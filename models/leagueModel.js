// models/leagueModel.js
const db = require('../config/db');

const LeagueModel = {
    createLeague: async (name, description, createdBy) => {
        try {
          const result = await db.query(
            `INSERT INTO league (name, description, created_by)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, description, createdBy]
          );
          return result.rows[0];
        } catch (err) {
          console.error('❌ DB Insert Error:', err); // <== Add this line
          throw err;
        }
      },

  joinLeague: async (leagueId, userId) => {
    const result = await db.query(
      `INSERT INTO league_member (league_id, user_id)
       VALUES ($1, $2) RETURNING *`,
      [leagueId, userId]
    );
    return result.rows[0];
  },

  getAllLeagues: async () => {
    const result = await db.query(`SELECT * FROM league`);
    return result.rows;
  },

  getStandingsByLeagueId: async (leagueId) => {
    const result = await db.query(
      `SELECT 
        u.user_id,
        u.full_name,
        COUNT(g.id) AS games_played,
        ROUND(AVG(g.total_score), 2) AS avg_score
       FROM game g
       JOIN "user" u ON g.user_id = u.user_id
       WHERE g.league_id = $1
       GROUP BY u.user_id, u.full_name
       ORDER BY avg_score DESC`,
      [leagueId]
    );
    return result.rows;
  },
};

module.exports = LeagueModel;
