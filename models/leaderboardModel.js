const db = require('../config/db');

const getLeaderboard = async () => {
    const result = await db.query(`
      WITH game_scores AS (
        SELECT 
          g.game_id,
          g.user_id,
          SUM(f.frame_score) AS total_score
        FROM game g
        JOIN frame f ON f.game_id = g.game_id
        GROUP BY g.game_id, g.user_id
      )
      SELECT 
        u.user_id,
        u.full_name,
        COUNT(gs.game_id) AS games_played,
        MAX(gs.total_score) AS highest_score,
        ROUND(AVG(gs.total_score)::numeric, 0) AS average_score
      FROM "user" u
      JOIN game_scores gs ON gs.user_id = u.user_id
      GROUP BY u.user_id, u.full_name
      ORDER BY average_score DESC
      LIMIT 10
    `);
  
    return result.rows;
  };
  

module.exports = { getLeaderboard };
// This code defines a leaderboard model for managing bowling game statistics.
// It uses the pg library to interact with a PostgreSQL database.
// The model includes a function to retrieve the leaderboard data.  