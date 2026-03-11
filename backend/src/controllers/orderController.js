const db = require('../config/db');

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
      `SELECT ci2.product_id, ci2.quantity, p.price, p.name, p.image, p.stock
       FROM cart ci
       JOIN cart_items ci2 ON ci2.cart_id = ci.id
       JOIN products p ON p.id = ci2.product_id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Save delivery address
    const [addrResult] = await conn.query(
      `INSERT INTO addresses (user_id, first_name, last_name, phone, address_line, city, state, zip_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, first_name, last_name, phone || null, address_line, city, state, zip_code]
    );
    const addressId = addrResult.insertId;

    // 3. Calculate totals
    const freeShippingThreshold = 50;
    const shippingCost = 5.99;
    const subTotal = cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    for (const item of cartRows) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, item.product_id, item.name, item.image,
          item.quantity, item.price,
          parseFloat((item.price * item.quantity).toFixed(2)),
        ]
      );
    }

    // 6. Clear the cart
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
        `SELECT product_name, product_image, quantity, unit_price, total_price
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
      `SELECT product_id, product_name, product_image, quantity, unit_price, total_price
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
