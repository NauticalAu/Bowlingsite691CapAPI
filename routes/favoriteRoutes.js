const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool
const authenticate = require('../middleware/auth'); // Adjust based on your auth setup

// POST /api/favorites
router.post('/', authenticate, async (req, res) => {
  const { name, address, place_id } = req.body;
  const userId = req.session.userId; // Adjust if using token-based auth

  if (!name || !address || !place_id) {
    return res.status(400).json({ error: 'Missing alley info' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO favorite (user_id, name, address, place_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, address, place_id]
    );
    res.status(201).json({ favorite: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

module.exports = router;
