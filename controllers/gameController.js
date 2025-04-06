const Game = require('../models/gameModel');

const startGame = async (req, res) => {
  try {
    const userId = req.session.userId;
    const game = await Game.createGame(userId);
    res.status(201).json({ message: 'Game started', game });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start game' });
  }
};

const submitScore = async (req, res) => {
  try {
    const { gameId, frame, pins } = req.body;
    const result = await Game.addScore(gameId, frame, pins);
    res.json({ message: 'Score submitted', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('🔍 userId from session:', req.session.userId);

    const summary = await Game.getUserGames(userId);
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch game summary' });
  }
};

module.exports = {
  startGame,
  submitScore,
  getSummary
};
// This code defines a gameController for managing bowling games.   