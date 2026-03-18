const db = require('../config/db');

// ── GET /api/products ────────────────────────────────────────
// Supports ?category=slug&subcategory=slug&search=text&featured=true&page=1&limit=20
const getProducts = async (req, res) => {
  const { category, subcategory, search, featured, page = 1, limit = 20 } = req.query;

  try {
    let whereClauses = ['p.is_active = 1'];
    let params = [];

    if (category) {
      whereClauses.push('cat.slug = ?');
      params.push(category);
    }

    if (subcategory) {
      whereClauses.push('sub.slug = ?');
      params.push(subcategory);
    }

    if (search) {
      whereClauses.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      whereClauses.push('p.is_featured = 1');
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const sql = `
      SELECT
        p.id, p.name, p.slug, p.description, p.price,
        COALESCE(pq.total_qty, p.stock) AS stock,
        p.stock AS legacy_stock,
        p.image, p.rating, p.reviews_count, p.is_featured,
        p.product_manufacturer AS manufacturer_id,
        m.manufacturer_name,
        m.code AS manufacturer_code,
        cat.name  AS category,
        cat.slug  AS category_slug,
        sub.name  AS subcategory,
        sub.slug  AS subcategory_slug
      FROM products p
      LEFT JOIN manufacturer m ON m.id = p.product_manufacturer
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      LEFT JOIN (
        SELECT prod_id, SUM(qty) AS total_qty
        FROM product_qty
        WHERE status = 1
        GROUP BY prod_id
      ) pq ON pq.prod_id = p.id
      ${where}
      ORDER BY p.id
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit), offset);

    const [rows] = await db.query(sql, params);

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN categories sub ON sub.id = p.subcategory_id
      ${where}
    `;
    const [countRows] = await db.query(countSql, params.slice(0, -2));

    return res.json({
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countRows[0].total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/products/:id ────────────────────────────────────
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
         p.id, p.name, p.slug, p.description, p.overview, p.price,
         COALESCE(pq.total_qty, p.stock) AS stock,
         p.stock AS legacy_stock,
         p.image, p.rating, p.reviews_count, p.is_featured,
         p.product_manufacturer AS manufacturer_id,
         m.manufacturer_name,
         m.code AS manufacturer_code,
         cat.name AS category, cat.slug AS category_slug,
         sub.name AS subcategory, sub.slug AS subcategory_slug
       FROM products p
       LEFT JOIN manufacturer m ON m.id = p.product_manufacturer
       LEFT JOIN categories cat ON cat.id = p.category_id
       LEFT JOIN categories sub ON sub.id = p.subcategory_id
       LEFT JOIN (
         SELECT prod_id, SUM(qty) AS total_qty
         FROM product_qty
         WHERE status = 1
         GROUP BY prod_id
       ) pq ON pq.prod_id = p.id
       WHERE p.id = ? AND p.is_active = 1`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Product not found' });

    const product = rows[0];

    // Fetch product detail bullets
    const [details] = await db.query(
      'SELECT label, description FROM product_details WHERE product_id = ? ORDER BY sort_order',
      [id]
    );

    const [variants] = await db.query(
      'SELECT id, weight, qty FROM product_qty WHERE prod_id = ? AND status = 1 ORDER BY id',
      [id]
    );

    product.details = details;
    product.variants = variants;
    product.manufacturer = product.manufacturer_id
      ? {
          id: product.manufacturer_id,
          name: product.manufacturer_name,
          code: product.manufacturer_code,
        }
      : null;
    product.inStock = Number(product.stock || 0) > 0;

    return res.json({ data: product });
  } catch (err) {
    console.error('getProductById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProductById };
