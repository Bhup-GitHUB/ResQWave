const sqlite3 = require('sqlite3').verbose();

// Open the database (NO changes needed to path)
const db = new sqlite3.Database('./relief.db');

// Query the database
db.all('SELECT * FROM aid_requests', (err, rows) => {
  if (err) {
    console.error('❌ Error querying database:', err.message);
  } else {
    console.log('✅ Records from aid_requests table:');
    console.table(rows); // Nicely formatted output
  }
  db.close();
});
