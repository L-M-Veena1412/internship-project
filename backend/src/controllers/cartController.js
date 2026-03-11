const db = require('../config/db');

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
         ci.id, ci.quantity,
         p.id AS product_id, p.name, p.price, p.image, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    return res.json({ data: items });
  } catch (err) {
    console.error('getCart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/cart/items ──────────────────────────────────────
const addToCart = async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id || quantity < 1)
    return res.status(400).json({ message: 'product_id and valid quantity required' });

  try {
    // Verify product exists and is in stock
    const [products] = await db.query(
      'SELECT id, stock FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );
    if (products.length === 0)
      return res.status(404).json({ message: 'Product not found' });

    if (products[0].stock < quantity)
      return res.status(400).json({ message: 'Not enough stock available' });

    const cartId = await getOrCreateCart(req.user.id);

    // Upsert: if already in cart, increase quantity
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity]
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
      'SELECT id FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Cart item not found' });

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
