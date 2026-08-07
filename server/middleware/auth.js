const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fixmate_super_secret_jwt_key_2026_hackathon';

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user suspension status in DB if user or worker
    if (decoded.role === 'customer') {
      const customer = await db.queryOne('SELECT is_suspended FROM customers WHERE id = ?', [decoded.id]);
      if (!customer) return res.status(401).json({ error: 'User account not found' });
      if (customer.is_suspended) return res.status(403).json({ error: 'Account suspended. Contact support.' });
    } else if (decoded.role === 'worker') {
      const worker = await db.queryOne('SELECT is_suspended FROM workers WHERE id = ?', [decoded.id]);
      if (!worker) return res.status(401).json({ error: 'Worker account not found' });
      if (worker.is_suspended) return res.status(403).json({ error: 'Worker account suspended. Contact support.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
