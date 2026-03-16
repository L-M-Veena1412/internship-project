const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

// Helper: generate JWT
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    // Check duplicate email
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashed]
    );

    const token = signToken({ id: result.insertId, email, role: 'customer' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim(), role: 'customer' },
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const [rows] = await db.query(
      'SELECT id, name, email, password, role, is_active FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = rows[0];

    if (!user.is_active)
      return res.status(403).json({ message: 'Account is disabled' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── PATCH /api/auth/me ───────────────────────────────────────
const updateMe = async (req, res) => {
  const { name, phone } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone || null, req.user.id]
    );

    const [rows] = await db.query(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    return res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    console.error('updateMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe, updateMe };
