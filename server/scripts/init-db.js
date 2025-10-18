const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create animals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Visit', 'Treatment', 'Observation')),
        description TEXT NOT NULL,
        event_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully!');
    
    // Insert sample data
    const sampleAnimals = [
      { name: 'Buddy', species: 'Dog', birth_date: '2020-03-15' },
      { name: 'Whiskers', species: 'Cat', birth_date: '2019-07-22' },
      { name: 'Charlie', species: 'Bird', birth_date: '2021-01-10' }
    ];

    for (const animal of sampleAnimals) {
      // Check if animal already exists
      const existing = await pool.query(
        'SELECT id FROM animals WHERE name = ? AND species = ?',
        [animal.name, animal.species]
      );
      
      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO animals (name, species, birth_date) VALUES (?, ?, ?)',
          [animal.name, animal.species, animal.birth_date]
        );
      }
    }

    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
