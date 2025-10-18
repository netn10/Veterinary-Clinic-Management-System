const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const { DEFAULT_ITEMS_PER_PAGE } = require('../config/pagination')

// GET /api/events - Get all events with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || DEFAULT_ITEMS_PER_PAGE
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM events')
    const totalItems = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get paginated results
    const result = await pool.query(`
      SELECT 
        e.*, 
        a.name as animal_name, 
        a.species 
      FROM events e 
      JOIN animals a ON e.animal_id = a.id 
      ORDER BY e.event_date DESC
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
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// DELETE /api/events/:id - Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }

    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ error: 'Failed to delete event' })
  }
})

module.exports = router
