const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create SQLite database connection
const dbPath = path.join(dataDir, 'veterinary_clinic.db');
const db = new sqlite3.Database(dbPath);

// Create a simple query wrapper to match the PostgreSQL interface
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (sql.trim().toLowerCase().startsWith('select')) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ rows: [{ id: this.lastID }] });
        });
      }
    });
  }
};

module.exports = pool;
