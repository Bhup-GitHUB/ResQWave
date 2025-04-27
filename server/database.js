const sqlite3 = require('sqlite3');

// Set up SQLite Database connection
const db = new sqlite3.Database('./relief.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database connected');
  }
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT,
    description TEXT,
    photo TEXT
  )
`);

module.exports = db;
