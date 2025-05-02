const Game = require('../models/gameModel');
const { calculateScores } = require('../services/scoreService');

// Start a new game
const startGame = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const game = await Game.createGame(userId);
    res.status(201).json({ message: 'Game started', game });
  } catch (err) {
    next(err);
  }
};

// Submit a frame’s score
const submitScore = async (req, res, next) => {
  try {
    const { gameId, frameNumber, firstRoll, secondRoll, bonusRoll } = req.body;

    if (!gameId || !frameNumber || firstRoll == null) {
      return res.status(400).json({ error: 'Missing required score fields' });
    }

    const result = await Game.addScore(
      gameId,
      frameNumber,
      firstRoll,
      secondRoll ?? null,
      bonusRoll ?? null
    );

    // Recalculate total (and persist, if your service does that)
    const totalScore = await calculateScores(gameId);

    res.json({
      message: 'Score submitted and calculated',
      result,
      totalScore
    });
  } catch (err) {
    next(err);
  }
};

// Fetch the user’s full game summary
const getSummary = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const summary = await Game.getUserGames(userId);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

// Delete all games for the user
const deleteAllGames = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    await Game.deleteAllGames(userId);
    res.json({ message: 'All games deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startGame,
  submitScore,
  getSummary,
  deleteAllGames
};
