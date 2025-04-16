const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../models/leaderboardModel');

router.get('/', async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json({ leaderboard });
  } catch (err) {
    console.error('❌ Error getting leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
