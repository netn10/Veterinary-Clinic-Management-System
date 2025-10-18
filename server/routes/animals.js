const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const ExcelJS = require('exceljs')
const { DEFAULT_ITEMS_PER_PAGE } = require('../config/pagination')

// GET /api/animals - List all animals with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || DEFAULT_ITEMS_PER_PAGE
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM animals')
    const totalItems = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get paginated results
    const result = await pool.query(`
      SELECT
        id,
        name,
        species,
        birth_date,
        EXTRACT(YEAR FROM AGE(birth_date)) as age
      FROM animals
      ORDER BY name
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    res.json({
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching animals:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to fetch animals'
    res.status(500).json({ error: errorMessage })
  }
})

// POST /api/animals - Add a new animal
router.post('/', async (req, res) => {
  try {
    const { name, species, birth_date } = req.body

    if (!name || !species || !birth_date) {
      return res.status(400).json({ error: 'Name, species, and birth_date are required' })
    }

    // Validate that birth_date is not in the future
    const birthDate = new Date(birth_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison

    if (birthDate > today) {
      return res.status(400).json({ error: 'Birth date cannot be in the future' })
    }

    const result = await pool.query(
      'INSERT INTO animals (name, species, birth_date) VALUES ($1, $2, $3) RETURNING *',
      [name, species, birth_date]
    )

    // Get the inserted record with calculated age
    const inserted = await pool.query(
      'SELECT *, EXTRACT(YEAR FROM AGE(birth_date)) as age FROM animals WHERE id = $1',
      [result.rows[0].id]
    )

    res.status(201).json(inserted.rows[0])
  } catch (error) {
    console.error('Error creating animal:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to create animal'
    res.status(500).json({ error: errorMessage })
  }
})

// GET /api/animals/:id/export - Export animal data to Excel (must come before /:id)
router.get('/:id/export', async (req, res) => {
  try {
    const { id } = req.params

    // Get animal details
    const animalResult = await pool.query(
      'SELECT *, EXTRACT(YEAR FROM AGE(birth_date)) as age FROM animals WHERE id = $1',
      [id]
    )

    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' })
    }

    const animal = animalResult.rows[0]

    // Get events for this animal
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE animal_id = $1 ORDER BY event_date DESC',
      [id]
    )

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`${animal.name} - Events Report`)

    // Add animal information
    worksheet.addRow(['Animal Information'])
    worksheet.addRow(['Name:', animal.name])
    worksheet.addRow(['Species:', animal.species])
    worksheet.addRow(['Birth Date:', animal.birth_date])
    worksheet.addRow(['Age:', `${animal.age} years`])
    worksheet.addRow([])

    // Add events table
    worksheet.addRow(['Events'])
    worksheet.addRow(['Date', 'Type', 'Description'])

    eventsResult.rows.forEach(event => {
      worksheet.addRow([
        event.event_date,
        event.type,
        event.description
      ])
    })

    // Style the worksheet
    worksheet.getRow(1).font = { bold: true, size: 14 }
    worksheet.getRow(7).font = { bold: true }
    worksheet.getRow(8).font = { bold: true }

    // Set column widths
    worksheet.columns = [
      { width: 12 },
      { width: 15 },
      { width: 50 }
    ]

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    // Handle cases where animal name might be null, undefined, or empty
    const animalName = animal.name && animal.name.trim() ? animal.name.trim() : 'Unknown_Animal'
    const filename = `${animalName}_events_report.xlsx`
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    // Write to response
    await workbook.xlsx.write(res)
    res.end()

  } catch (error) {
    console.error('Error exporting data:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to export data'
    res.status(500).json({ error: errorMessage })
  }
})

// POST /api/animals/:id/events - Add an event for an animal
router.post('/:id/events', async (req, res) => {
  try {
    const { id } = req.params
    const { type, description, event_date } = req.body

    if (!type || !description || !event_date) {
      return res.status(400).json({ error: 'Type, description, and event_date are required' })
    }

    // Validate event type
    const validTypes = ['Visit', 'Treatment', 'Observation']
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid event type. Must be Visit, Treatment, or Observation' })
    }

    const result = await pool.query(
      'INSERT INTO events (animal_id, type, description, event_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, type, description, event_date]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating event:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to create event'
    res.status(500).json({ error: errorMessage })
  }
})

// DELETE /api/animals/:animalId/events/:eventId - Delete an event
router.delete('/:animalId/events/:eventId', async (req, res) => {
  try {
    const { animalId, eventId } = req.params

    console.log('DELETE event request - animalId:', animalId, 'eventId:', eventId)

    // Check if event exists and belongs to this animal
    const eventResult = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND animal_id = $2',
      [parseInt(eventId), parseInt(animalId)]
    )

    console.log('Event query result:', eventResult.rows)

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // Delete the event
    await pool.query('DELETE FROM events WHERE id = $1', [parseInt(eventId)])

    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to delete event'
    res.status(500).json({ error: errorMessage })
  }
})

// GET /api/animals/:id - Get animal details with paginated events
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || DEFAULT_ITEMS_PER_PAGE
    const offset = (page - 1) * limit

    // Get animal details
    const animalResult = await pool.query(
      'SELECT *, EXTRACT(YEAR FROM AGE(birth_date)) as age FROM animals WHERE id = $1',
      [id]
    )

    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' })
    }

    // Get total events count for this animal
    const eventsCountResult = await pool.query(
      'SELECT COUNT(*) FROM events WHERE animal_id = $1',
      [id]
    )
    const totalEvents = parseInt(eventsCountResult.rows[0].count)
    const totalPages = Math.ceil(totalEvents / limit)

    // Get paginated events for this animal
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE animal_id = $1 ORDER BY event_date DESC LIMIT $2 OFFSET $3',
      [id, limit, offset]
    )

    res.json({
      ...animalResult.rows[0],
      events: eventsResult.rows,
      eventsPagination: {
        currentPage: page,
        totalPages,
        totalItems: totalEvents,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching animal details:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to fetch animal details'
    res.status(500).json({ error: errorMessage })
  }
})

// PUT /api/animals/:id - Update an animal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, species, birth_date } = req.body

    if (!name || !species || !birth_date) {
      return res.status(400).json({ error: 'Name, species, and birth_date are required' })
    }

    // Validate that birth_date is not in the future
    const birthDate = new Date(birth_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison

    if (birthDate > today) {
      return res.status(400).json({ error: 'Birth date cannot be in the future' })
    }

    // Check if animal exists
    const animalResult = await pool.query(
      'SELECT * FROM animals WHERE id = $1',
      [id]
    )

    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' })
    }

    // Update the animal
    await pool.query(
      'UPDATE animals SET name = $1, species = $2, birth_date = $3 WHERE id = $4',
      [name, species, birth_date, id]
    )

    // Get the updated record with calculated age
    const updated = await pool.query(
      'SELECT *, EXTRACT(YEAR FROM AGE(birth_date)) as age FROM animals WHERE id = $1',
      [id]
    )

    res.json(updated.rows[0])
  } catch (error) {
    console.error('Error updating animal:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to update animal'
    res.status(500).json({ error: errorMessage })
  }
})

// DELETE /api/animals/:id - Delete an animal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Check if animal exists
    const animalResult = await pool.query(
      'SELECT * FROM animals WHERE id = $1',
      [id]
    )

    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' })
    }

    // Delete associated events first (foreign key constraint)
    await pool.query('DELETE FROM events WHERE animal_id = $1', [id])

    // Delete the animal
    await pool.query('DELETE FROM animals WHERE id = $1', [id])

    res.json({ message: 'Animal deleted successfully' })
  } catch (error) {
    console.error('Error deleting animal:', error)
    const errorMessage = error.code === 'ECONNREFUSED'
      ? 'Database connection refused. Please check if the database is running.'
      : error.code === 'ENOTFOUND'
        ? 'Database host not found. Please check database configuration.'
        : error.message || 'Failed to delete animal'
    res.status(500).json({ error: errorMessage })
  }
})

module.exports = router
