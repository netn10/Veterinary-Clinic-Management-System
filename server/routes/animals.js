const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const ExcelJS = require('exceljs');

// GET /api/animals - List all animals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        species, 
        birth_date,
        CAST((julianday('now') - julianday(birth_date)) / 365.25 AS INTEGER) as age
      FROM animals 
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

// POST /api/animals - Add a new animal
router.post('/', async (req, res) => {
  try {
    const { name, species, birth_date } = req.body;
    
    if (!name || !species || !birth_date) {
      return res.status(400).json({ error: 'Name, species, and birth_date are required' });
    }

    const result = await pool.query(
      'INSERT INTO animals (name, species, birth_date) VALUES (?, ?, ?)',
      [name, species, birth_date]
    );
    
    // Get the inserted record
    const inserted = await pool.query(
      'SELECT * FROM animals WHERE id = ?',
      [result.rows[0].id]
    );
    
    res.status(201).json(inserted.rows[0]);
  } catch (error) {
    console.error('Error creating animal:', error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// GET /api/animals/:id/export - Export animal data to Excel (must come before /:id)
router.get('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get animal details
    const animalResult = await pool.query(
      'SELECT *, CAST((julianday("now") - julianday(birth_date)) / 365.25 AS INTEGER) as age FROM animals WHERE id = ?',
      [id]
    );
    
    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    const animal = animalResult.rows[0];
    
    // Get events for this animal
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE animal_id = ? ORDER BY event_date DESC',
      [id]
    );
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${animal.name} - Events Report`);
    
    // Add animal information
    worksheet.addRow(['Animal Information']);
    worksheet.addRow(['Name:', animal.name]);
    worksheet.addRow(['Species:', animal.species]);
    worksheet.addRow(['Birth Date:', animal.birth_date]);
    worksheet.addRow(['Age:', `${animal.age} years`]);
    worksheet.addRow([]);
    
    // Add events table
    worksheet.addRow(['Events']);
    worksheet.addRow(['Date', 'Type', 'Description']);
    
    eventsResult.rows.forEach(event => {
      worksheet.addRow([
        event.event_date,
        event.type,
        event.description
      ]);
    });
    
    // Style the worksheet
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(7).font = { bold: true };
    worksheet.getRow(8).font = { bold: true };
    
    // Set column widths
    worksheet.columns = [
      { width: 12 },
      { width: 15 },
      { width: 50 }
    ];
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${animal.name}_events_report.xlsx"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// POST /api/animals/:id/events - Add an event for an animal
router.post('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, event_date } = req.body;
    
    if (!type || !description || !event_date) {
      return res.status(400).json({ error: 'Type, description, and event_date are required' });
    }
    
    // Validate event type
    const validTypes = ['Visit', 'Treatment', 'Observation'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid event type. Must be Visit, Treatment, or Observation' });
    }
    
    const result = await pool.query(
      'INSERT INTO events (animal_id, type, description, event_date) VALUES (?, ?, ?, ?)',
      [id, type, description, event_date]
    );
    
    // Get the inserted event
    const inserted = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [result.rows[0].id]
    );
    
    res.status(201).json(inserted.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/animals/:animalId/events/:eventId - Delete an event
router.delete('/:animalId/events/:eventId', async (req, res) => {
  try {
    const { animalId, eventId } = req.params;

    console.log('DELETE event request - animalId:', animalId, 'eventId:', eventId);

    // Check if event exists and belongs to this animal
    const eventResult = await pool.query(
      'SELECT * FROM events WHERE id = ? AND animal_id = ?',
      [parseInt(eventId), parseInt(animalId)]
    );

    console.log('Event query result:', eventResult.rows);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete the event
    await pool.query('DELETE FROM events WHERE id = ?', [parseInt(eventId)]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// GET /api/animals/:id - Get animal details with events
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get animal details
    const animalResult = await pool.query(
      'SELECT *, CAST((julianday("now") - julianday(birth_date)) / 365.25 AS INTEGER) as age FROM animals WHERE id = ?',
      [id]
    );
    
    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    // Get events for this animal
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE animal_id = ? ORDER BY event_date DESC',
      [id]
    );
    
    res.json({
      ...animalResult.rows[0],
      events: eventsResult.rows
    });
  } catch (error) {
    console.error('Error fetching animal details:', error);
    res.status(500).json({ error: 'Failed to fetch animal details' });
  }
});

// DELETE /api/animals/:id - Delete an animal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if animal exists
    const animalResult = await pool.query(
      'SELECT * FROM animals WHERE id = ?',
      [id]
    );

    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    // Delete associated events first (foreign key constraint)
    await pool.query('DELETE FROM events WHERE animal_id = ?', [id]);

    // Delete the animal
    await pool.query('DELETE FROM animals WHERE id = ?', [id]);

    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal:', error);
    res.status(500).json({ error: 'Failed to delete animal' });
  }
});

module.exports = router;