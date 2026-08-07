const db = require('../config/db');

exports.getPendingWorkers = async (req, res) => {
  try {
    const pendingWorkers = await db.query(
      `SELECT id, name, email, phone, profession, experience_years, description, 
              profile_photo_url, service_area, price_min, price_max, created_at 
       FROM workers 
       WHERE is_verified = 0 AND is_suspended = 0 
       ORDER BY created_at DESC`
    );

    for (const w of pendingWorkers) {
      const cats = await db.query(
        `SELECT c.id, c.name, c.icon FROM categories c 
         JOIN worker_categories wc ON c.id = wc.category_id 
         WHERE wc.worker_id = ?`,
        [w.id]
      );
      w.categories = cats;
    }

    res.json(pendingWorkers);
  } catch (err) {
    console.error('getPendingWorkers error:', err);
    res.status(500).json({ error: 'Failed to fetch pending workers' });
  }
};

exports.verifyWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const targetValue = is_verified !== undefined ? (is_verified ? 1 : 0) : 1;

    await db.query('UPDATE workers SET is_verified = ? WHERE id = ?', [targetValue, id]);

    const updated = await db.queryOne('SELECT id, name, is_verified FROM workers WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error('verifyWorker error:', err);
    res.status(500).json({ error: 'Failed to update worker verification status' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const customers = await db.query(
      'SELECT id, name, email, phone, address, is_suspended, created_at, \'customer\' as user_type FROM customers ORDER BY created_at DESC'
    );
    const workers = await db.query(
      'SELECT id, name, email, phone, profession, is_verified, is_suspended, rating_avg, created_at, \'worker\' as user_type FROM workers ORDER BY created_at DESC'
    );

    res.json({
      customers,
      workers
    });
  } catch (err) {
    console.error('getUsers admin error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_suspended } = req.body;

    const suspendVal = is_suspended ? 1 : 0;

    if (role === 'customer') {
      await db.query('UPDATE customers SET is_suspended = ? WHERE id = ?', [suspendVal, id]);
    } else if (role === 'worker') {
      await db.query('UPDATE workers SET is_suspended = ? WHERE id = ?', [suspendVal, id]);
    } else {
      return res.status(400).json({ error: 'Role must be customer or worker' });
    }

    res.json({ id, role, is_suspended: Boolean(suspendVal), message: `User status updated` });
  } catch (err) {
    console.error('suspendUser error:', err);
    res.status(500).json({ error: 'Failed to update user suspension status' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await db.query(
      `SELECT 
        b.id, b.date, b.time, b.address, b.notes, b.status, b.created_at,
        c.name as customer_name, c.email as customer_email,
        w.name as worker_name, w.profession as worker_profession,
        cat.name as category_name
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN workers w ON b.worker_id = w.id
      LEFT JOIN categories cat ON b.category_id = cat.id
      ORDER BY b.created_at DESC`
    );

    res.json(bookings);
  } catch (err) {
    console.error('getAllBookings admin error:', err);
    res.status(500).json({ error: 'Failed to fetch all bookings' });
  }
};
