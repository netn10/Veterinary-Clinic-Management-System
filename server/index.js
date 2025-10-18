const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const animalsRoutes = require('./routes/animals');
const eventsRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/animals', animalsRoutes);
app.use('/api/events', eventsRoutes);

// Serve static files from Vue build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch all handler for Vue.js routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
