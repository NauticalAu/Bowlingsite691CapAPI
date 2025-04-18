const Game = require('../models/gameModel');
const { calculateScores } = require('../services/scoreService'); 

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
    const { gameId, frame, firstRoll, secondRoll, bonusRoll } = req.body;

    if (!gameId || !frame || firstRoll == null) {
      return res.status(400).json({ error: 'Missing required score fields' });
    }

    const result = await Game.addScore(
      gameId,
      frame,
      firstRoll,
      secondRoll || null,
      bonusRoll || null
    );

    // Recalculate scores
    const totalScore = await calculateScores(gameId); // make sure this updates DB

    res.json({
      message: 'Score submitted and calculated',
      result,
      totalScore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};
// Fetch game summary for the user

const getSummary = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('🔍 userId from session:', userId);

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
