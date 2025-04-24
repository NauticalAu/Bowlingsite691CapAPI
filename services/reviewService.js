const db = require('../config/db');

// List reviews for a given place_id
exports.getByPlace = async (placeId) => {
  const res = await db.query(
    `SELECT r.review_id, r.rating, r.content, r.created_at,
            u.full_name AS reviewer
       FROM review r
       JOIN user u ON r.user_id = u.user_id
      WHERE r.place_id = $1
      ORDER BY r.created_at DESC`,
    [placeId]
  );
  return res.rows;
};

// Create a new review for a place_id
exports.create = async (placeId, userId, rating, content) => {
  const res = await db.query(
    `INSERT INTO review (place_id, user_id, rating, content)
         VALUES ($1,$2,$3,$4)
      RETURNING *`,
    [placeId, userId, rating, content]
  );
  return res.rows[0];
};