import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    for (let i = 1; i <= 60; i++) {
      await pool.query(
        'INSERT INTO wishes (name, message, created_at) VALUES ($1, $2, $3)',
        [`Guest ${i}`, `This is simulated wish number ${i}! Best wishes!`, new Date(Date.now() - i * 1000)]
      );
    }
    console.log("60 simulated wishes inserted successfully.");
  } catch (err) {
    console.error("Error inserting wishes:", err);
  } finally {
    pool.end();
  }
})();
