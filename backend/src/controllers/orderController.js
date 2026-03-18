const db = require('../config/db');

const INR_RATE = 83;
const FREE_DELIVERY_THRESHOLD_INR = 100;
const DELIVERY_FEE_INR = 49;

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

const getBaseVariantWeights = async (conn, productIds) => {
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
  const [rows] = await conn.query(
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

const syncProductStock = async (conn, productId) => {
  const [sumRows] = await conn.query(
    'SELECT COALESCE(SUM(qty), 0) AS total_qty FROM product_qty WHERE prod_id = ? AND status = 1',
    [productId]
  );

  await conn.query('UPDATE products SET stock = ? WHERE id = ?', [Number(sumRows[0].total_qty), productId]);
};

const deductVariantStock = async (conn, productQtyId, quantity) => {
  const [rows] = await conn.query(
    `SELECT id, prod_id, qty
     FROM product_qty
     WHERE id = ? AND status = 1
     FOR UPDATE`,
    [productQtyId]
  );

  if (rows.length === 0) {
    return false;
  }

  const variant = rows[0];
  if (Number(variant.qty || 0) < Number(quantity)) {
    return false;
  }

  await conn.query('UPDATE product_qty SET qty = qty - ? WHERE id = ?', [quantity, productQtyId]);
  await syncProductStock(conn, variant.prod_id);
  return true;
};

const deductProductStockByProduct = async (conn, productId, quantity) => {
  const [variants] = await conn.query(
    `SELECT id, qty
     FROM product_qty
     WHERE prod_id = ? AND status = 1
     ORDER BY id
     FOR UPDATE`,
    [productId]
  );

  // If variant rows exist, consume stock across available variants.
  if (variants.length > 0) {
    let remaining = Number(quantity);

    for (const variant of variants) {
      if (remaining <= 0) break;

      const currentQty = Number(variant.qty || 0);
      if (currentQty <= 0) continue;

      const deductQty = Math.min(currentQty, remaining);
      await conn.query('UPDATE product_qty SET qty = qty - ? WHERE id = ?', [deductQty, variant.id]);
      remaining -= deductQty;
    }

    if (remaining > 0) {
      return false;
    }

    await syncProductStock(conn, productId);
    return true;
  }

  // Backward compatibility for products that still rely on products.stock.
  const [updateResult] = await conn.query(
    'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
    [quantity, productId, quantity]
  );

  return updateResult.affectedRows > 0;
};

// ── POST /api/orders ─────────────────────────────────────────
// Checkout: saves address, creates order, saves order items, clears cart
const placeOrder = async (req, res) => {
  const {
    first_name, last_name, phone,
    address_line, city, state, zip_code,
    payment_method = 'card',
    notes,
  } = req.body;

  if (!first_name || !last_name || !address_line || !city || !state || !zip_code)
    return res.status(400).json({ message: 'All address fields are required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Get user's cart items
    const [cartRows] = await conn.query(
      `SELECT
         ci2.product_id, ci2.product_qty_id, ci2.quantity,
         p.price, p.name, p.image,
         pv.weight,
         pv.qty AS variant_stock,
         COALESCE(pq.total_qty, p.stock) AS available_stock
       FROM cart ci
       JOIN cart_items ci2 ON ci2.cart_id = ci.id
       JOIN products p ON p.id = ci2.product_id
       LEFT JOIN product_qty pv ON pv.id = ci2.product_qty_id
       LEFT JOIN (${productStockSubquery}) pq ON pq.prod_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cartRows) {
      const quantity = Number(item.quantity);
      if (item.product_qty_id) {
        if (item.variant_stock === null || Number(item.variant_stock) < quantity) {
          await conn.rollback();
          return res.status(409).json({ message: `Insufficient stock for ${item.name}` });
        }
      } else if (Number(item.available_stock) < quantity) {
        await conn.rollback();
        return res.status(409).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const productIds = [...new Set(cartRows.map((item) => item.product_id))];
    const baseWeightMap = await getBaseVariantWeights(conn, productIds);

    const pricedRows = cartRows.map((item) => {
      const basePrice = Number(item.price || 0);
      const baseWeight = baseWeightMap.get(String(item.product_id));
      const effectivePrice = item.product_qty_id
        ? scalePriceByWeight(basePrice, item.weight, baseWeight)
        : basePrice;

      return {
        ...item,
        effective_price: effectivePrice,
      };
    });

    // 2. Save delivery address
    const [addrResult] = await conn.query(
      `INSERT INTO addresses (user_id, first_name, last_name, phone, address_line, city, state, zip_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, first_name, last_name, phone || null, address_line, city, state, zip_code]
    );
    const addressId = addrResult.insertId;

    // 3. Calculate totals
    const freeShippingThreshold = FREE_DELIVERY_THRESHOLD_INR / INR_RATE;
    const shippingCost = DELIVERY_FEE_INR / INR_RATE;
    const subTotal = pricedRows.reduce((sum, item) => sum + item.effective_price * item.quantity, 0);
    const shipping  = subTotal > freeShippingThreshold ? 0 : shippingCost;
    const total     = parseFloat((subTotal + shipping).toFixed(2));

    // 4. Create the order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, address_id, total_amount, shipping_cost, payment_method, payment_status, notes)
       VALUES (?, ?, ?, ?, ?, 'successful', ?)`,
      [req.user.id, addressId, total, shipping, payment_method, notes || null]
    );
    const orderId = orderResult.insertId;

    // 5. Insert order items (snapshotting price + name at time of order)
    for (const item of pricedRows) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_qty_id, product_weight, product_name, product_image, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.product_id, item.product_qty_id || null, item.weight || null, item.name, item.image,
          item.quantity, item.effective_price,
          parseFloat((item.effective_price * item.quantity).toFixed(2)),
        ]
      );
    }

    // 6. Deduct stock after order item snapshots are written
    for (const item of cartRows) {
      const stockUpdated = item.product_qty_id
        ? await deductVariantStock(conn, item.product_qty_id, item.quantity)
        : await deductProductStockByProduct(conn, item.product_id, item.quantity);

      if (!stockUpdated) {
        await conn.rollback();
        return res.status(409).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // 7. Clear the cart
    const [cartInfo] = await conn.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (cartInfo.length > 0) {
      await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cartInfo[0].id]);
    }

    await conn.commit();

    return res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total,
    });
  } catch (err) {
    await conn.rollback();
    console.error('placeOrder error:', err);
    return res.status(500).json({ message: 'Server error during checkout' });
  } finally {
    conn.release();
  }
};

// ── GET /api/orders/my ───────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT id, total_amount, shipping_cost, order_status, payment_status, payment_method, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // For each order, attach items
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT product_name, product_image, product_weight, quantity, unit_price, total_price
         FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return res.json({ data: orders });
  } catch (err) {
    console.error('getMyOrders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/orders/:id ──────────────────────────────────────
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT o.id, o.total_amount, o.shipping_cost, o.order_status, o.payment_status,
              o.payment_method, o.created_at,
              a.first_name, a.last_name, a.address_line, a.city, a.state, a.zip_code
       FROM orders o
       LEFT JOIN addresses a ON a.id = o.address_id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, req.user.id]
    );

    if (orders.length === 0)
      return res.status(404).json({ message: 'Order not found' });

    const order = orders[0];

    const [items] = await db.query(
      `SELECT product_id, product_qty_id, product_weight, product_name, product_image, quantity, unit_price, total_price
       FROM order_items WHERE order_id = ?`,
      [id]
    );
    order.items = items;

    return res.json({ data: order });
  } catch (err) {
    console.error('getOrderById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
