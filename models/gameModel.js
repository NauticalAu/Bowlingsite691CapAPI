const db = require('../config/db');

const createGame = async (userId) => {
  const result = await db.query(
    `INSERT INTO game (user_id, created_at) VALUES ($1, NOW()) RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

const addScore = async (gameId, frame, pins) => {
  const result = await db.query(
    `INSERT INTO score (game_id, frame, pins) VALUES ($1, $2, $3) RETURNING *`,
    [gameId, frame, pins]
  );
  return result.rows[0];
};

const getUserGames = async (userId) => {
  const query = `
    SELECT 
      g.game_id AS game_id,  
      s.frame,
      s.pins
    FROM game g
    JOIN score s ON g.game_id = s.game_id  
    WHERE g.user_id = $1
    ORDER BY g.game_id, s.frame           
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