const db = require('../config/db');

const productStockSubquery = `
  SELECT prod_id, SUM(qty) AS total_qty
  FROM product_qty
  WHERE status = 1
  GROUP BY prod_id
`;

const parseWeightToUnit = (weight) => {
  if (!weight && weight !== 0) return null;

  const normalized = String(weight).trim().toLowerCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*(kg|g|mg|l|ml)$/);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2];
  if (!Number.isFinite(value) || value <= 0) return null;

  switch (unit) {
    case 'kg':
      return value * 1000;
    case 'g':
      return value;
    case 'mg':
      return value / 1000;
    case 'l':
      return value * 1000;
    case 'ml':
      return value;
    default:
      return null;
  }
};

const scalePriceByWeight = (basePrice, selectedWeight, baseWeight) => {
  const unitPrice = Number(basePrice || 0);
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return 0;

  const selected = parseWeightToUnit(selectedWeight);
  if (!Number.isFinite(selected) || selected <= 0) return unitPrice;

  if (!Number.isFinite(baseWeight) || baseWeight <= 0) return unitPrice;

  return Number((unitPrice * (selected / baseWeight)).toFixed(2));
};

const getBaseVariantWeights = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) return new Map();

  const normalizedProductIds = productIds
    .map((id) => {
      if (id === null || id === undefined) return null;
      if (typeof id === 'bigint') return id.toString();
      return String(id);
    })
    .filter((id) => id !== null);

  if (normalizedProductIds.length === 0) return new Map();

  const placeholders = normalizedProductIds.map(() => '?').join(',');
  const [rows] = await db.query(
    `SELECT prod_id, weight
     FROM product_qty
     WHERE status = 1 AND prod_id IN (${placeholders})`,
    normalizedProductIds
  );

  const baseWeightMap = new Map();

  for (const row of rows) {
    const parsed = parseWeightToUnit(row.weight);
    if (!Number.isFinite(parsed) || parsed <= 0) continue;

    const productIdKey = String(row.prod_id);
    const current = baseWeightMap.get(productIdKey);
    if (!current || parsed < current) {
      baseWeightMap.set(productIdKey, parsed);
    }
  }

  return baseWeightMap;
};

const getProductWithAvailableStock = async (productId) => {
  const [rows] = await db.query(
    `SELECT p.id, COALESCE(pq.total_qty, p.stock) AS available_stock
     FROM products p
     LEFT JOIN (${productStockSubquery}) pq ON pq.prod_id = p.id
     WHERE p.id = ? AND p.is_active = 1`,
    [productId]
  );

  return rows[0] || null;
};

const getActiveVariantForProduct = async (productQtyId, productId) => {
  const [rows] = await db.query(
    `SELECT id, prod_id, weight, qty
     FROM product_qty
     WHERE id = ? AND prod_id = ? AND status = 1`,
    [productQtyId, productId]
  );

  return rows[0] || null;
};

const productHasVariants = async (productId) => {
  const [rows] = await db.query(
    'SELECT 1 FROM product_qty WHERE prod_id = ? AND status = 1 LIMIT 1',
    [productId]
  );
  return rows.length > 0;
};

// Helper: get or create cart for user
const getOrCreateCart = async (userId) => {
  const [rows] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (rows.length > 0) return rows[0].id;

  const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
  return result.insertId;
};

// ── GET /api/cart ─────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);

    const [items] = await db.query(
      `SELECT
         ci.id, ci.quantity, ci.product_qty_id,
         p.id AS product_id, p.name, p.price, p.image,
         pv.weight,
         CASE
           WHEN ci.product_qty_id IS NOT NULL THEN COALESCE(pv.qty, 0)
           ELSE COALESCE(pq.total_qty, p.stock)
         END AS stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       LEFT JOIN product_qty pv ON pv.id = ci.product_qty_id
       LEFT JOIN (${productStockSubquery}) pq ON pq.prod_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    const productIds = [...new Set(items.map((item) => item.product_id))];
    const baseWeightMap = await getBaseVariantWeights(productIds);

    const pricedItems = items.map((item) => {
      const basePrice = Number(item.price || 0);
      const baseWeight = baseWeightMap.get(String(item.product_id));
      const effectivePrice = item.product_qty_id
        ? scalePriceByWeight(basePrice, item.weight, baseWeight)
        : basePrice;

      return {
        ...item,
        price: effectivePrice,
        base_price: basePrice,
      };
    });

    return res.json({ data: pricedItems });
  } catch (err) {
    console.error('getCart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/cart/items ──────────────────────────────────────
const addToCart = async (req, res) => {
  const { product_id, quantity = 1, product_qty_id = null } = req.body;

  if (!product_id || quantity < 1)
    return res.status(400).json({ message: 'product_id and valid quantity required' });

  try {
    const product = await getProductWithAvailableStock(product_id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const hasVariants = await productHasVariants(product_id);
    if (hasVariants && !product_qty_id) {
      return res.status(400).json({ message: 'product_qty_id is required for variant products' });
    }

    let variant = null;
    let availableStock = Number(product.available_stock);
    if (product_qty_id) {
      variant = await getActiveVariantForProduct(product_qty_id, product_id);
      if (!variant)
        return res.status(404).json({ message: 'Selected product variant not found' });

      availableStock = Number(variant.qty || 0);
    }

    const cartId = await getOrCreateCart(req.user.id);

    // Upsert: if already in cart, increase quantity
    const [existing] = await db.query(
      `SELECT id, quantity
       FROM cart_items
       WHERE cart_id = ? AND product_id = ?
         AND ${product_qty_id ? 'product_qty_id = ?' : 'product_qty_id IS NULL'}`,
      product_qty_id ? [cartId, product_id, product_qty_id] : [cartId, product_id]
    );

    const existingQty = existing.length > 0 ? Number(existing[0].quantity) : 0;
    const requestedTotal = existingQty + Number(quantity);

    if (availableStock < requestedTotal)
      return res.status(400).json({ message: 'Not enough stock available' });

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, product_qty_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, product_id, product_qty_id, quantity]
      );
    }

    return res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error('addToCart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── PATCH /api/cart/items/:itemId ─────────────────────────────
const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1)
    return res.status(400).json({ message: 'Quantity must be at least 1' });

  try {
    const cartId = await getOrCreateCart(req.user.id);

    const [rows] = await db.query(
      `SELECT ci.id, ci.product_id, ci.product_qty_id, pv.qty AS variant_stock
       FROM cart_items ci
       LEFT JOIN product_qty pv ON pv.id = ci.product_qty_id
       WHERE ci.id = ? AND ci.cart_id = ?`,
      [itemId, cartId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Cart item not found' });

    if (rows[0].product_qty_id) {
      if (rows[0].variant_stock === null)
        return res.status(404).json({ message: 'Selected product variant not found' });

      if (Number(quantity) > Number(rows[0].variant_stock || 0))
        return res.status(400).json({ message: 'Not enough stock available' });
    } else {
      const product = await getProductWithAvailableStock(rows[0].product_id);
      if (!product)
        return res.status(404).json({ message: 'Product not found' });

      if (Number(quantity) > Number(product.available_stock))
        return res.status(400).json({ message: 'Not enough stock available' });
    }

    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);

    return res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error('updateCartItem error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── DELETE /api/cart/items/:itemId ────────────────────────────
const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cartId = await getOrCreateCart(req.user.id);

    const [rows] = await db.query(
      'SELECT id FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Cart item not found' });

    await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);

    return res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('removeCartItem error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── DELETE /api/cart ──────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    return res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('clearCart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
