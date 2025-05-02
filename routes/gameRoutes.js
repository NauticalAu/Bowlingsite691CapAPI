const express = require('express');
const router = express.Router();
const { createScoreRules, validate } = require('../validators/scoreValidator');
const gameController = require('../controllers/gameController');

// Start a new game
router.post('/start', gameController.startGame);

// Submit score for a game
router.post(
    '/score',
    createScoreRules,
    validate,
     gameController.submitScore
    );

// Get score summary
router.get('/summary', gameController.getSummary);

// DELETE /api/games
router.delete('/', gameController.deleteAllGames);

module.exports = router;
// This code sets up routes for a bowling game API.
// It uses Express.js to create a router.   