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

    console.log('🔥 /api/games/score hit');
    console.log('📝 Frame Submission:', { gameId, frame, firstRoll, secondRoll, bonusRoll });

    // ✅ This line inserts the frame into the database
    const result = await Game.addScore(gameId, frame, firstRoll, secondRoll, bonusRoll);

    console.log('✅ Frame saved in controller:', result);

    res.json({ message: 'Score submitted successfully', result });
  } catch (err) {
    console.error('❌ Failed to insert score:', err.message);
    res.status(500).json({ error: 'Failed to insert score' });
  }
};

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
