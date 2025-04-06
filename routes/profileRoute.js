const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get current user's profile
router.get('/', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const result = await db.query('SELECT user_id, full_name, email FROM users WHERE user_id = $1', [req.session.userId]);
    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Update current user's profile
router.put('/', async (req, res) => {
  const { fullName, email } = req.body;
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const result = await db.query(
      'UPDATE users SET full_name = $1, email = $2 WHERE user_id = $3 RETURNING user_id, full_name, email',
      [fullName, email, req.session.userId]
    );
    res.json({ message: 'Profile updated', profile: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
// This code defines a profile route for managing user profiles.
// It uses Express.js to create a router for handling GET and PUT requests.
// The GET request retrieves the current user's profile based on their session ID.
// The PUT request updates the user's profile with new information.
// Both requests check if the user is logged in by verifying the session ID.
// If the user is not logged in, a 401 Unauthorized error is returned.
// The router is exported for use in the main server file.
// The code uses async/await syntax for handling asynchronous database queries.
// It also includes error handling to log errors and return appropriate responses.
// The database queries are parameterized to prevent SQL injection attacks.
// The code assumes that a session management system is in place to track user sessions.    