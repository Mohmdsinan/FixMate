const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existing = await db.queryOne('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const catId = db.generateUUID();
    await db.query('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)', [
      catId,
      name.trim(),
      icon || 'Wrench'
    ]);

    const newCategory = await db.queryOne('SELECT * FROM categories WHERE id = ?', [catId]);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('createCategory error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('deleteCategory error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
