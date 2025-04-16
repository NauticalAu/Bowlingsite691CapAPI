const db = require('../config/db');

const getLeaderboard = async () => {
  const result = await db.query(`
    SELECT 
      u.user_id,
      u.full_name,
      COUNT(DISTINCT g.game_id) AS games_played,
      MAX(SUM(f.frame_score)) AS highest_score,
      ROUND(AVG(SUM(f.frame_score))::numeric, 0) AS average_score
    FROM "user" u
    JOIN game g ON g.user_id = u.user_id
    JOIN frame f ON f.game_id = g.game_id
    GROUP BY u.user_id, u.full_name
    ORDER BY average_score DESC
    LIMIT 10
  `);
  return result.rows;
};

module.exports = { getLeaderboard };
