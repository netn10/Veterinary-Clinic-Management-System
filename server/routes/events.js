const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/events - Get all events (optional endpoint)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.*, 
        a.name as animal_name, 
        a.species 
      FROM events e 
      JOIN animals a ON e.animal_id = a.id 
      ORDER BY e.event_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// DELETE /api/events/:id - Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
