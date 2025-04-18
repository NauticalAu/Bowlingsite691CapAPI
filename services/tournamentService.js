const db = require('../config/db');


// Get all tournaments
exports.getAll = async () => {
  const result = await db.query(`
    SELECT t.*, a.name AS alley_name
    FROM tournament t
    LEFT JOIN bowling_alleys a ON t.bowling_alley_id = a.id
    WHERE t.start_date >= CURRENT_DATE
    ORDER BY t.start_date ASC
  `);
  return result.rows;
};

// Get tournament by ID
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM tournament WHERE id = $1', [id]);
  return result.rows[0];
};

// Create a new tournament
exports.create = async (data) => {
  const { name, description, start_date, end_date, alley_id, organizer_id } = data;

  const result = await db.query(
    `INSERT INTO tournament (name, description, start_date, end_date, bowling_alley_id, organizer_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, start_date, end_date, alley_id, organizer_id]
  );

  return result.rows[0];
};

// Delete a tournament
exports.delete = async (tournamentId) => {
    await db.query('DELETE FROM tournament WHERE id = $1', [tournamentId]);
  };
  
  

// Join a tournament
exports.join = async (tournamentId, userId) => {
  await db.query(
    `INSERT INTO tournament_participants (tournament_id, user_id)
     VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [tournamentId, userId]
  );
  return { message: 'Joined tournament' };
};

// Leave a tournament
exports.leave = async (tournamentId, userId) => {
  await db.query(
    `DELETE FROM tournament_participants
     WHERE tournament_id = $1 AND user_id = $2`,
    [tournamentId, userId]
  );
  return { message: 'Left tournament' };
};
// Get participants of a tournament
exports.getParticipants = async (tournamentId) => {
  const result = await db.query(
    `SELECT u.user_id, u.full_name
     FROM tournament_participants tp
     JOIN users u ON tp.user_id = u.user_id
     WHERE tp.tournament_id = $1`,
    [tournamentId]
  );
  return result.rows;
};
// Get tournaments by alley ID
exports.getByAlleyId = async (alleyId) => {
  const result = await db.query(
    `SELECT * FROM tournament WHERE bowling_alley_id = $1 ORDER BY start_date`,
    [alleyId]
  );
  return result.rows;
};
// Get tournaments by organizer ID
exports.getByOrganizerId = async (organizerId) => {
    const result = await db.query(
      `SELECT * FROM tournament WHERE organizer_id = $1 ORDER BY start_date`,
      [organizerId]
    );
    return result.rows;
  };
  