const { Pool } = require('pg');

// Gunakan DATABASE_URL
const poolConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL, 
      ssl: { rejectUnauthorized: false } 
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

// Debugging di Vercel Logs
pool.on('error', (err) => {
  console.error('DATABASE_ERROR:', err.message);
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};