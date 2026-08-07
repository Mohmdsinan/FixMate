const db = require('../config/db');

exports.getMe = async (req, res) => {
  try {
    const customer = await db.queryOne(
      'SELECT id, name, email, phone, address, is_suspended, created_at FROM customers WHERE id = ?',
      [req.user.id]
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error('getMe customer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    await db.query(
      'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name.trim(), phone || null, address || null, req.user.id]
    );

    const updated = await db.queryOne(
      'SELECT id, name, email, phone, address, is_suspended, created_at FROM customers WHERE id = ?',
      [req.user.id]
    );
    res.json(updated);
  } catch (err) {
    console.error('updateMe customer error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await db.query(
      `SELECT 
        b.id, b.date, b.time, b.address, b.notes, b.status, b.created_at,
        w.id as worker_id, w.name as worker_name, w.profession as worker_profession, w.profile_photo_url as worker_photo, w.phone as worker_phone,
        c.id as category_id, c.name as category_name, c.icon as category_icon,
        r.id as review_id, r.rating as review_rating, r.review_text
      FROM bookings b
      JOIN workers w ON b.worker_id = w.id
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE b.customer_id = ?
      ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json(bookings);
  } catch (err) {
    console.error('getMyBookings customer error:', err);
    res.status(500).json({ error: 'Failed to fetch customer bookings' });
  }
};
