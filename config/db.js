const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // ✅ Required for Render and other hosted PG
  }
});

pool.query('SELECT 1')
  .then(() => console.log('Connected to PostgreSQL ✅'))
  .catch((err) => console.error('Database connection error ❌', err.stack));

module.exports = pool;

// This code connects to a PostgreSQL database using the pg library.
// It uses environment variables to get the database connection string.
// The connection string is stored in a .env file.
// The code also handles SSL connections for remote databases.
// The pool.connect() method is used to establish a connection to the database.
// If the connection is successful, it logs a success message.
// If there is an error, it logs the error message.
// The pool object is exported for use in other modules.
// The code uses the dotenv library to load environment variables from a .env file.             