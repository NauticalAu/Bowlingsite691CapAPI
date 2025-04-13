const db = require('../config/db');

exports.getById = async (id) => {
  const result = await db.query(`
    SELECT id, name, address, phone, website_url, open_hours, rating
    FROM bowling_alley
    WHERE id = $1
  `, [id]);

  return result.rows[0];
};

exports.findByZip = async (zip) => {
    const result = await db.query(
      'SELECT * FROM bowling_alley WHERE zip_code = $1',
      [zip]
    );
    return result.rows;
  };