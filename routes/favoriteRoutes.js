const express = require('express');
const router = express.Router();

// Load the shared PostgreSQL pool
const pool = require('../config/db');

// Auth middleware to protect the route (adjust if you're using token or session-based auth)
const authenticate = require('../middleware/auth');

// --------------------------------------------
// POST /api/favorites → Save a new favorite
// --------------------------------------------
router.post('/', authenticate, async (req, res) => {
  const { name, address, place_id } = req.body;
  const userId = req.session.userId; // or req.user.id if using token-based auth

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
    console.error('Error saving favorite:', err);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

// --------------------------------------------
// GET /api/favorites → List all of the user's favorites
// --------------------------------------------
router.get('/', authenticate, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM favorite WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ favorites: result.rows });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// --------------------------------------------
// DELETE /api/favorites/:id → Remove a specific favorite
// --------------------------------------------
router.delete('/:id', authenticate, async (req, res) => {
  const userId = req.session.userId;
  const favoriteId = req.params.id;

  try {
    await pool.query(
      'DELETE FROM favorite WHERE id = $1 AND user_id = $2',
      [favoriteId, userId]
    );
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error('Error deleting favorite:', err);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

module.exports = router;
// This code defines a set of routes for managing user favorites in a bowling alley application.
// It uses Express.js to create a router for handling HTTP requests.
// The routes include:
// - POST /api/favorites: Save a new favorite bowling alley for the authenticated user.
// - GET /api/favorites: List all of the user's favorite bowling alleys.
// - DELETE /api/favorites/:id: Remove a specific favorite bowling alley by its ID.
