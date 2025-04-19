// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;
// This code sets up a connection to a PostgreSQL database using the `pg` library.
// It exports a `pool` object that can be used to query the database.
// The connection string is taken from an environment variable, allowing for different configurations in development and production.
// The SSL option is set to `false` in development for local testing, but enabled in production for secure connections.
// The `rejectUnauthorized` option is set to `false` to allow self-signed certificates in production.
// This is useful for applications that need to connect to a database securely in a production environment.
// The `pool` object allows for efficient management of database connections, enabling the application to handle multiple requests concurrently.
// It is a common practice to use a connection pool in Node.js applications to improve performance and resource management.