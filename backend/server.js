import express from 'express';
import { createPool } from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const db = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images');
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.delete('/deletetag/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    const sql = 'DELETE FROM subject_tags WHERE id = ?';
    await connection.execute(sql, [id]);
    connection.release();
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.post('/addtag', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const image = `images/${req.file.filename}`;
    const { tag, objective, count } = req.body;

    if (!tag || !count || !objective) {
      return res.status(400).send('Tag, count, and objective are required');
    }

    const connection = await db.getConnection();
    const sql = 'INSERT INTO subject_tags (tag, objective, count, image) VALUES (?, ?, ?, ?)';
    await connection.execute(sql, [tag, objective, count, image]);
    connection.release();

    res.status(201).json({ message: 'Tag added successfully', filePath: image });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/newpage', (req, res) => {
  res.send('You have been redirected to the new page');
});

app.put('/edittag/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tag, count } = req.body;

    if (!tag || !count) {
      return res.status(400).json({ error: 'Tag and count are required' });
    }

    const connection = await db.getConnection();
    const sql = 'UPDATE subject_tags SET tag = ?, count = ? WHERE id = ?';
    await connection.execute(sql, [tag, count, id]);
    connection.release();

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/addcontent', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM content'); // Replace 'your_content_table' with the actual table name
    connection.release();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});



app.post('/addlevel', async (req, res) => {
  try {
    const { main_id, content, level } = req.body;

    if (!main_id || !content || !level) {
      return res.status(400).send('Main ID, content, and level are required');
    }

    const connection = await db.getConnection();
    const sql = 'INSERT INTO content (main_id, content, level) VALUES (?, ?, ?)';
    await connection.execute(sql, [main_id, content, level]);
    connection.release();

    res.status(201).json({ message: 'Level added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/tags', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM subject_tags');
    connection.release();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/login', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM authentication');
    connection.release();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM authentication WHERE email = ? AND password = ?', [email, password]);
    connection.release();

    if (rows.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM authentication WHERE email = ?', [email]);

    if (rows.length === 0) {
      // If the user does not exist, create a new user
      await connection.execute('INSERT INTO authentication (email, name, google_id) VALUES (?, ?, ?)', [email, name, googleId]);
    }

    connection.release();
    res.status(200).json({ message: 'Login successful', email, name });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/addlevel', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM content');
    connection.release();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});