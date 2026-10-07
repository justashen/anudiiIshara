// backend/server.js
import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';

const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env");
}

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, 
        email TEXT UNIQUE, 
        password TEXT, 
        role TEXT
      );
    `).catch(() => {}); // ignore if users exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY, 
        name TEXT, 
        message TEXT, 
        created_at TIMESTAMP,
        participant_name TEXT
      );
    `);
    
    // Add column if it doesn't exist (migration)
    await pool.query(`ALTER TABLE wishes ADD COLUMN IF NOT EXISTS participant_name TEXT;`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name TEXT,
        hash TEXT UNIQUE,
        attending BOOLEAN DEFAULT NULL,
        party TEXT DEFAULT 'Uncategorised',
        created_at TIMESTAMP
      );
    `);

    // Add column if it doesn't exist (migration)
    await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS party TEXT DEFAULT 'Uncategorised';`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        hearts_count INTEGER DEFAULT 0
      );
    `);
    
    const statsResult = await pool.query('SELECT * FROM stats WHERE id = 1');
    if (statsResult.rows.length === 0) {
      await pool.query('INSERT INTO stats (id, hearts_count) VALUES (1, 0)');
    }

    const email = process.env.ADMIN_EMAIL;
    const plainPwd = process.env.ADMIN_PASSWORD;

    if (!email || !plainPwd) {
      console.warn("WARNING: ADMIN_EMAIL or ADMIN_PASSWORD not set. Admin user creation skipped.");
    } else {
      const hashed = await bcrypt.hash(plainPwd, 10);
      
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
          [email, hashed, 'admin']
        );
        console.log('Default user created');
      } else {
        await pool.query(
          'UPDATE users SET password = $1 WHERE email = $2',
          [hashed, email]
        );
        console.log('Default user password updated');
      }
    }
    console.log('Database connected and initialized.');
  } catch (err) {
    console.error('Database connection error. Is PostgreSQL running?', err.message);
  }
})();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; 
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/wishes', async (req, res) => {
  const { name, message, hash } = req.body;
  const createdAt = new Date();
  
  try {
    let participantName = null;
    if (hash) {
      const p = await pool.query('SELECT name FROM participants WHERE hash = $1', [hash]);
      if (p.rows.length > 0) {
        participantName = p.rows[0].name;
      }
    }

    await pool.query(
      'INSERT INTO wishes (name, message, created_at, participant_name) VALUES ($1, $2, $3, $4)', 
      [name, message, createdAt, participantName]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error inserting wish:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/wishes', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query('SELECT * FROM wishes ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    const countResult = await pool.query('SELECT COUNT(*) FROM wishes');
    const total = parseInt(countResult.rows[0].count);

    res.json({ data: result.rows, total, page, limit });
  } catch (err) {
    console.error('Error fetching wishes:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/wishes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM wishes WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting wish:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// --- PARTICIPANTS / RSVP ROUTES ---

app.post('/participants', authMiddleware, async (req, res) => {
  const { name, party } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  const hash = crypto.randomBytes(6).toString('hex'); // e.g. 12 chars
  const p = party || 'Uncategorised';
  try {
    await pool.query(
      'INSERT INTO participants (name, hash, party, created_at) VALUES ($1, $2, $3, $4)', 
      [name, hash, p, new Date()]
    );
    res.json({ success: true, hash });
  } catch (err) {
    console.error('Error creating participant:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/participants', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM participants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/participants/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM participants WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/participants/:id', authMiddleware, async (req, res) => {
  const { name, party } = req.body;
  const { id } = req.params;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  const p = party || 'Uncategorised';
  try {
    await pool.query('UPDATE participants SET name = $1, party = $2 WHERE id = $3', [name, p, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/rsvp/:hash', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, attending FROM participants WHERE hash = $1', [req.params.hash]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/rsvp/:hash', async (req, res) => {
  const { attending } = req.body;
  try {
    await pool.query('UPDATE participants SET attending = $1 WHERE hash = $2', [attending, req.params.hash]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/hearts', async (req, res) => {
  try {
    const result = await pool.query('SELECT hearts_count FROM stats WHERE id = 1');
    if (result.rows.length === 0) return res.json({ count: 0 });
    res.json({ count: result.rows[0].hearts_count });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/hearts', async (req, res) => {
  const { clicks } = req.body;
  const numClicks = parseInt(clicks) || 1;
  try {
    const result = await pool.query('UPDATE stats SET hearts_count = hearts_count + $1 WHERE id = 1 RETURNING hearts_count', [numClicks]);
    if (result.rows.length === 0) return res.json({ count: 0 });
    res.json({ count: result.rows[0].hearts_count });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.API_PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🔐 Backend listening on http://localhost:${PORT}`));
}

export default app;
