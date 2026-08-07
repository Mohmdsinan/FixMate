const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fixmate_super_secret_jwt_key_2026_hackathon';

// Customer Register
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.queryOne('SELECT id FROM customers WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customerId = db.generateUUID();

    await db.query(
      'INSERT INTO customers (id, name, email, phone, password_hash, address) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, name.trim(), email.trim().toLowerCase(), phone || null, passwordHash, address || null]
    );

    const userPayload = { id: customerId, email: email.trim().toLowerCase(), role: 'customer', name: name.trim() };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: userPayload });
  } catch (err) {
    console.error('Customer Register Error:', err);
    res.status(500).json({ error: 'Failed to register customer' });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const customer = await db.queryOne('SELECT * FROM customers WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (customer.is_suspended) {
      return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
    }

    const match = await bcrypt.compare(password, customer.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userPayload = { id: customer.id, email: customer.email, role: 'customer', name: customer.name };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Customer Login Error:', err);
    res.status(500).json({ error: 'Failed to log in customer' });
  }
};

// Worker Register
exports.registerWorker = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      categoryIds,
      profession,
      experience_years,
      description,
      service_area,
      price_min,
      price_max
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.queryOne('SELECT id FROM workers WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existing) {
      return res.status(400).json({ error: 'A worker account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const workerId = db.generateUUID();

    await db.query(
      `INSERT INTO workers (
        id, name, email, phone, password_hash, profession, experience_years, description, service_area, price_min, price_max, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        workerId,
        name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        passwordHash,
        profession || null,
        parseInt(experience_years) || 0,
        description || null,
        service_area || null,
        price_min ? parseFloat(price_min) : null,
        price_max ? parseFloat(price_max) : null
      ]
    );

    // Link category IDs if provided
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        await db.query('INSERT INTO worker_categories (worker_id, category_id) VALUES (?, ?)', [workerId, catId]);
      }
    }

    const userPayload = { id: workerId, email: email.trim().toLowerCase(), role: 'worker', name: name.trim() };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: userPayload });
  } catch (err) {
    console.error('Worker Register Error:', err);
    res.status(500).json({ error: 'Failed to register worker' });
  }
};

// Worker Login
exports.loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const worker = await db.queryOne('SELECT * FROM workers WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!worker) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (worker.is_suspended) {
      return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
    }

    const match = await bcrypt.compare(password, worker.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userPayload = { id: worker.id, email: worker.email, role: 'worker', name: worker.name };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Worker Login Error:', err);
    res.status(500).json({ error: 'Failed to log in worker' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await db.queryOne('SELECT * FROM admins WHERE LOWER(username) = LOWER(?)', [username.trim()]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const userPayload = { id: admin.id, username: admin.username, role: 'admin' };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ error: 'Failed to log in admin' });
  }
};
