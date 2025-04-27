const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Commenting out Fluvio for now
// const { publishToFluvio } = require('./fluvio'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SQLite setup
const db = new sqlite3.Database('./relief.db', (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Database connected');

    // Ensure table exists
    db.run(`CREATE TABLE IF NOT EXISTS aid_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      image_path TEXT
    )`);
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/requests', (req, res) => {
  db.all('SELECT * FROM aid_requests', (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

// SUBMIT route
app.post('/submit', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const imagePath = req.file ? req.file.path : null;

  db.run(
    'INSERT INTO aid_requests (name, description, image_path) VALUES (?, ?, ?)',
    [name, description, imagePath],
    function (err) {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ success: false, message: 'Failed to submit' });
      } else {
        console.log('New aid request added with ID:', this.lastID);

        // Skipping Fluvio publish to avoid error
        console.log('Skipping Fluvio publish...');

        res.json({ success: true, message: 'Submission successful' });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
