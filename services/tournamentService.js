// src/services/tournamentService.js
const db = require('../config/db');

// Get all upcoming tournaments
exports.getAll = async () => {
  const { rows } = await db.query(`
    SELECT t.*, a.name AS alley_name
      FROM tournament t
      LEFT JOIN bowling_alleys a
        ON t.bowling_alley_id = a.id
     WHERE t.start_date >= CURRENT_DATE
     ORDER BY t.start_date ASC
  `);
  return rows;
};

// Get tournament by ID
exports.getById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM tournament WHERE tournament_id = $1',
    [id]
  );
  return rows[0] || null;
};

// Create a new tournament
exports.create = async ({ name, description, start_date, end_date, bowling_alley_id, organizer_id }) => {
  const { rows } = await db.query(
    `INSERT INTO tournament
       (name, description, start_date, end_date, bowling_alley_id, organizer_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, start_date, end_date, bowling_alley_id, organizer_id]
  );
  return rows[0];
};

// Delete a tournament
exports.delete = async (tournamentId) => {
  await db.query(
    'DELETE FROM tournament WHERE tournament_id = $1',
    [tournamentId]
  );
  return { message: 'Tournament deleted' };
};

// Update a tournament
exports.update = async (tournamentId, changes) => {
  const keys = Object.keys(changes);
  if (!keys.length) return null;

  const setClause = keys
    .map((col, i) => `${col} = $${i + 2}`)
    .join(', ');
  const values = [tournamentId, ...keys.map(k => changes[k])];

  const { rows } = await db.query(
    `UPDATE tournament
       SET ${setClause}
     WHERE tournament_id = $1
     RETURNING *`,
    values
  );
  return rows[0] || null;
};

// Join a tournament
exports.join = async (tournamentId, userId) => {
  await db.query(
    `INSERT INTO tournament_participants (tournament_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [tournamentId, userId]
  );
  return { message: 'Joined tournament' };
};

// Leave a tournament
exports.leave = async (tournamentId, userId) => {
  await db.query(
    `DELETE FROM tournament_participants
     WHERE tournament_id = $1
       AND user_id = $2`,
    [tournamentId, userId]
  );
  return { message: 'Left tournament' };
};

// Get participants of a tournament
exports.getParticipants = async (tournamentId) => {
  const { rows } = await db.query(
    `SELECT u.user_id, u.full_name
       FROM tournament_participants tp
       JOIN "user" u
         ON tp.user_id = u.user_id
      WHERE tp.tournament_id = $1`,
    [tournamentId]
  );
  return rows;
};

// Get tournaments by alley ID
exports.getByAlleyId = async (bowling_alley_id) => {
  const { rows } = await db.query(
    `SELECT * FROM tournament
      WHERE bowling_alley_id = $1
      ORDER BY start_date`,
    [bowling_alley_id]
  );
  return rows;
};

// Get tournaments by organizer ID
exports.getByOrganizerId = async (organizer_id) => {
  const { rows } = await db.query(
    `SELECT * FROM tournament
      WHERE organizer_id = $1
      ORDER BY start_date`,
    [organizer_id]
  );
  return rows;
};
