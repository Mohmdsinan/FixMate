const db = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { worker_id, category_id, date, time, address, notes } = req.body;

    if (!worker_id || !date || !time || !address || !address.trim()) {
      return res.status(400).json({ error: 'Worker, date, time, and address are required' });
    }

    // Validate worker exists and is verified
    const worker = await db.queryOne('SELECT id, is_verified, is_suspended, is_available FROM workers WHERE id = ?', [worker_id]);
    if (!worker || worker.is_suspended) {
      return res.status(404).json({ error: 'Worker not found or unavailable' });
    }

    // Validate future date
    const bookingDate = new Date(`${date}T${time}`);
    const now = new Date();
    // Allow today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (selectedDate < today) {
      return res.status(400).json({ error: 'Booking date must be in the future or today' });
    }

    const bookingId = db.generateUUID();
    await db.query(
      `INSERT INTO bookings (id, customer_id, worker_id, category_id, date, time, address, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [bookingId, customerId, worker_id, category_id || null, date, time, address.trim(), notes || null]
    );

    const booking = await db.queryOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['accepted', 'rejected', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await db.queryOne('SELECT * FROM bookings WHERE id = ? AND worker_id = ?', [id, workerId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not assigned to you' });
    }

    // Check status transition logic
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return res.status(400).json({ error: `Cannot update a ${booking.status} booking` });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    const updated = await db.queryOne('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error('updateBookingStatus error:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { id } = req.params;

    const booking = await db.queryOne('SELECT * FROM bookings WHERE id = ? AND customer_id = ?', [id, customerId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending' && booking.status !== 'accepted') {
      return res.status(400).json({ error: `Cannot cancel booking when status is '${booking.status}'` });
    }

    await db.query('UPDATE bookings SET status = \'cancelled\' WHERE id = ?', [id]);

    const updated = await db.queryOne('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error('cancelBooking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
