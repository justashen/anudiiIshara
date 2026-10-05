import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config({ path: '../.env' }); // Load .env from root

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await pool.query('TRUNCATE TABLE wishes RESTART IDENTITY;');
    console.log('Wishes table cleaned.');
    await pool.query('TRUNCATE TABLE participants RESTART IDENTITY;');
    console.log('Participants table cleaned.');
  } catch (err) {
    console.error('Error cleaning tables:', err);
  } finally {
    await pool.end();
  }
})();
