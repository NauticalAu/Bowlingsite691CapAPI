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

// Get tournament by ID (✅ fixed column name)
exports.getById = async (id) => {
  const result = await db.query('SELECT * FROM tournament WHERE tournament_id = $1', [id]);
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

// Delete a tournament (✅ fixed wrong db object and column name)
exports.delete = async (tournamentId) => {
  await db.query('DELETE FROM tournament WHERE tournament_id = $1', [tournamentId]);
  return { message: 'Tournament deleted' };
};

// Update a tournament (✅ fixed wrong db object and column name)
exports.update = async (tournamentId, changes) => {
  const keys = Object.keys(changes);
  if (!keys.length) return null;

  // Build "col1 = $2, col2 = $3, …" dynamically
  const setClause = keys
    .map((col, i) => `${col} = $${i + 2}`)
    .join(', ');

  const values = [tournamentId, ...keys.map(k => changes[k])];

  const result = await db.query(
    `UPDATE tournament
       SET ${setClause}
     WHERE tournament_id = $1
     RETURNING *`,
    values
  );

  return result.rows[0];  // will be undefined if no row was found
};


// Join a tournament (✅ already correct)
exports.join = async (tournamentId, userId) => {
  await db.query(
    `INSERT INTO tournament_participants (tournament_id, user_id)
     VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [tournamentId, userId]
  );
  return { message: 'Joined tournament' };
};

// Leave a tournament (✅ already correct)
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
     JOIN "user" u
       ON tp.user_id = u.user_id
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
