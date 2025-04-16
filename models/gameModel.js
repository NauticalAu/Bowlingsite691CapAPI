const db = require('../config/db');

const createGame = async (userId) => {
  const result = await db.query(
    `INSERT INTO game (user_id, created_at) VALUES ($1, NOW()) RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

const addScore = async (gameId, frameNumber, firstRoll, secondRoll = null, bonusRoll = null) => {
  console.log('📥 addScore():', {
    gameId,
    frameNumber,
    firstRoll,
    secondRoll,
    bonusRoll
  });

  try {
    const result = await db.query(
      `INSERT INTO frame (game_id, frame_number, first_roll, second_roll, bonus_roll)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [gameId, frameNumber, firstRoll, secondRoll, bonusRoll]
    );

    console.log('✅ Frame saved:', result.rows[0]);

    // ✅ Update total_score in the game table after insert
    await db.query(
      `UPDATE game
       SET total_score = (
         SELECT COALESCE(SUM(
           COALESCE(first_roll, 0) + COALESCE(second_roll, 0) + COALESCE(bonus_roll, 0)
         ), 0)
         FROM frame
         WHERE game_id = $1
       )
       WHERE game_id = $1`,
      [gameId]
    );

    return result.rows[0];
  } catch (err) {
    console.error('❌ Frame insert error:', err.message);
    throw err;
  }
};

const getUserGames = async (userId) => {
  const query = `
    SELECT 
      g.game_id AS game_id,
      f.frame_number,
      f.first_roll,
      f.second_roll,
      f.bonus_roll,
      f.frame_score
    FROM game g
    JOIN frame f ON g.game_id = f.game_id
    WHERE g.user_id = $1
    ORDER BY g.game_id, f.frame_number
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createGame,
  addScore,
  getUserGames
};

// This code defines a gameModel for managing bowling games.
// It uses the pg library to interact with a PostgreSQL database.
// The model includes functions to create a new game, add scores to a game, and retrieve user games.
// The functions use parameterized queries to prevent SQL injection attacks.
// The createGame function inserts a new game record into the games table.
// The addScore function inserts a new score record into the scores table.
// The getUserGames function retrieves all games and scores for a specific user from the database.
// It returns the results as an array of objects, each containing game and score information.
// This code is part of a larger application that manages bowling games.    