const db = require('../config/db');

// ── GET /api/categories ──────────────────────────────────────
// Returns parent categories with their subcategories nested
const getCategories = async (req, res) => {
  try {
    // Get all categories
    const [rows] = await db.query(
      'SELECT id, name, slug, description, image, parent_id FROM categories WHERE is_active = 1 ORDER BY id'
    );

    // Separate parents and children
    const parents = rows.filter(r => r.parent_id === null);
    const children = rows.filter(r => r.parent_id !== null);

    // Nest subcategories under each parent
    const result = parents.map(parent => ({
      ...parent,
      subcategories: children.filter(c => c.parent_id === parent.id),
    }));

    return res.json({ data: result });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/categories/:slug ────────────────────────────────
const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, name, slug, description, image, parent_id FROM categories WHERE slug = ? AND is_active = 1',
      [slug]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Category not found' });

    const category = rows[0];

    // If it's a parent, also fetch subcategories
    if (category.parent_id === null) {
      const [subs] = await db.query(
        'SELECT id, name, slug FROM categories WHERE parent_id = ? AND is_active = 1',
        [category.id]
      );
      category.subcategories = subs;
    }

    return res.json({ data: category });
  } catch (err) {
    console.error('getCategoryBySlug error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories, getCategoryBySlug };
