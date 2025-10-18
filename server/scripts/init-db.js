const pool = require('../config/database')

async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...')

    // Create animals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        species VARCHAR(255) NOT NULL,
        birth_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        animal_id INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('Visit', 'Treatment', 'Observation')),
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      )
    `)

    console.log('Database tables created successfully!')

    // Insert sample data
    const sampleAnimals = [
      { name: 'Buddy', species: 'Dog', birth_date: '2020-03-15' },
      { name: 'Whiskers', species: 'Cat', birth_date: '2019-07-22' },
      { name: 'Charlie', species: 'Bird', birth_date: '2021-01-10' }
    ]

    for (const animal of sampleAnimals) {
      // Check if animal already exists
      const existing = await pool.query(
        'SELECT id FROM animals WHERE name = $1 AND species = $2',
        [animal.name, animal.species]
      )

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO animals (name, species, birth_date) VALUES ($1, $2, $3)',
          [animal.name, animal.species, animal.birth_date]
        )
      }
    }

    console.log('Sample data inserted successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    await pool.end()
  }
}

initializeDatabase()
