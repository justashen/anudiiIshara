import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from root

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
