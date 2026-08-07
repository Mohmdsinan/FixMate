const db = require('../config/db');

exports.createReview = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { booking_id, rating, review_text } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({ error: 'Booking ID and rating (1-5) are required' });
    }

    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    // Check booking validity
    const booking = await db.queryOne('SELECT * FROM bookings WHERE id = ? AND customer_id = ?', [booking_id, customerId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Reviews can only be submitted for completed bookings' });
    }

    // Check if review already exists
    const existingReview = await db.queryOne('SELECT id FROM reviews WHERE booking_id = ?', [booking_id]);
    if (existingReview) {
      return res.status(400).json({ error: 'A review has already been submitted for this booking' });
    }

    const reviewId = db.generateUUID();
    await db.query(
      `INSERT INTO reviews (id, booking_id, customer_id, worker_id, rating, review_text)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reviewId, booking_id, customerId, booking.worker_id, numRating, review_text || null]
    );

    // Recalculate worker rating stats
    const stats = await db.queryOne(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE worker_id = ?',
      [booking.worker_id]
    );

    const count = parseInt(stats.count || 0);
    const avg = parseFloat(stats.avg_rating || 0).toFixed(1);

    await db.query(
      'UPDATE workers SET rating_count = ?, rating_avg = ? WHERE id = ?',
      [count, parseFloat(avg), booking.worker_id]
    );

    const createdReview = await db.queryOne('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    res.status(201).json(createdReview);
  } catch (err) {
    console.error('createReview error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

exports.getWorkerReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await db.query(
      `SELECT 
        r.id, r.rating, r.review_text, r.created_at,
        c.name as customer_name
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.worker_id = ?
      ORDER BY r.created_at DESC`,
      [id]
    );

    res.json(reviews);
  } catch (err) {
    console.error('getWorkerReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
