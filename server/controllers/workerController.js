const db = require('../config/db');
const { handlePhotoUpload } = require('../config/cloudinary');

exports.getWorkers = async (req, res) => {
  try {
    const { category, minRating, maxPrice, search, available } = req.query;

    let sql = `
      SELECT DISTINCT 
        w.id, w.name, w.email, w.phone, w.profession, w.experience_years,
        w.description, w.profile_photo_url, w.service_area, w.price_min,
        w.price_max, w.is_available, w.is_verified, w.rating_avg, w.rating_count, w.created_at
      FROM workers w
      LEFT JOIN worker_categories wc ON w.id = wc.worker_id
      LEFT JOIN categories c ON wc.category_id = c.id
      WHERE w.is_suspended = 0
    `;
    const params = [];

    // Category filter by ID or Name
    if (category) {
      sql += ` AND (c.id = ? OR LOWER(c.name) = LOWER(?))`;
      params.push(category, category);
    }

    // Rating filter
    if (minRating) {
      sql += ` AND w.rating_avg >= ?`;
      params.push(parseFloat(minRating));
    }

    // Price filter (worker price_min <= maxPrice)
    if (maxPrice) {
      sql += ` AND w.price_min <= ?`;
      params.push(parseFloat(maxPrice));
    }

    // Availability filter
    if (available === 'true' || available === '1') {
      sql += ` AND w.is_available = 1`;
    }

    // Search query filter (matches name, profession, description, service_area)
    if (search && search.trim() !== '') {
      const s = `%${search.trim().toLowerCase()}%`;
      sql += ` AND (LOWER(w.name) LIKE ? OR LOWER(w.profession) LIKE ? OR LOWER(w.description) LIKE ? OR LOWER(w.service_area) LIKE ?)`;
      params.push(s, s, s, s);
    }

    sql += ` ORDER BY w.rating_avg DESC, w.created_at DESC`;

    const workers = await db.query(sql, params);

    // Attach categories to each worker
    for (const worker of workers) {
      const cats = await db.query(
        `SELECT c.id, c.name, c.icon FROM categories c 
         JOIN worker_categories wc ON c.id = wc.category_id 
         WHERE wc.worker_id = ?`,
        [worker.id]
      );
      worker.categories = cats;
    }

    res.json(workers);
  } catch (err) {
    console.error('getWorkers error:', err);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await db.queryOne(
      `SELECT 
        id, name, email, phone, profession, experience_years, description, 
        profile_photo_url, service_area, price_min, price_max, is_available, 
        is_verified, is_suspended, rating_avg, rating_count, created_at 
       FROM workers WHERE id = ?`,
      [id]
    );

    if (!worker || worker.is_suspended) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Fetch categories
    const categories = await db.query(
      `SELECT c.id, c.name, c.icon FROM categories c 
       JOIN worker_categories wc ON c.id = wc.category_id 
       WHERE wc.worker_id = ?`,
      [id]
    );
    worker.categories = categories;

    res.json(worker);
  } catch (err) {
    console.error('getWorkerById error:', err);
    res.status(500).json({ error: 'Failed to fetch worker profile' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const workerId = req.user.id;
    const {
      name,
      phone,
      profession,
      experience_years,
      description,
      service_area,
      price_min,
      price_max,
      is_available,
      categoryIds
    } = req.body;

    await db.query(
      `UPDATE workers SET 
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        profession = COALESCE(?, profession),
        experience_years = COALESCE(?, experience_years),
        description = COALESCE(?, description),
        service_area = COALESCE(?, service_area),
        price_min = COALESCE(?, price_min),
        price_max = COALESCE(?, price_max),
        is_available = COALESCE(?, is_available)
      WHERE id = ?`,
      [
        name ? name.trim() : null,
        phone !== undefined ? phone : null,
        profession !== undefined ? profession : null,
        experience_years !== undefined ? parseInt(experience_years) : null,
        description !== undefined ? description : null,
        service_area !== undefined ? service_area : null,
        price_min !== undefined ? (price_min !== null ? parseFloat(price_min) : null) : null,
        price_max !== undefined ? (price_max !== null ? parseFloat(price_max) : null) : null,
        is_available !== undefined ? (is_available ? 1 : 0) : null,
        workerId
      ]
    );

    // Update categories if categoryIds provided
    if (Array.isArray(categoryIds)) {
      await db.query('DELETE FROM worker_categories WHERE worker_id = ?', [workerId]);
      for (const catId of categoryIds) {
        await db.query('INSERT INTO worker_categories (worker_id, category_id) VALUES (?, ?)', [workerId, catId]);
      }
    }

    const updatedWorker = await db.queryOne(
      'SELECT id, name, email, phone, profession, experience_years, description, profile_photo_url, service_area, price_min, price_max, is_available, is_verified, rating_avg, rating_count FROM workers WHERE id = ?',
      [workerId]
    );

    const categories = await db.query(
      `SELECT c.id, c.name, c.icon FROM categories c 
       JOIN worker_categories wc ON c.id = wc.category_id 
       WHERE wc.worker_id = ?`,
      [workerId]
    );
    updatedWorker.categories = categories;

    res.json(updatedWorker);
  } catch (err) {
    console.error('updateMe worker error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const photoUrl = await handlePhotoUpload(req.file);

    await db.query('UPDATE workers SET profile_photo_url = ? WHERE id = ?', [photoUrl, req.user.id]);

    res.json({ profile_photo_url: photoUrl, message: 'Photo uploaded successfully' });
  } catch (err) {
    console.error('uploadPhoto worker error:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await db.query(
      `SELECT 
        b.id, b.date, b.time, b.address, b.notes, b.status, b.created_at,
        c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
        cat.id as category_id, cat.name as category_name, cat.icon as category_icon,
        r.id as review_id, r.rating as review_rating, r.review_text
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN categories cat ON b.category_id = cat.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      WHERE b.worker_id = ?
      ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json(bookings);
  } catch (err) {
    console.error('getMyBookings worker error:', err);
    res.status(500).json({ error: 'Failed to fetch worker bookings' });
  }
};
