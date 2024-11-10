// server.js
const express = require('express');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require(`./routes/gameRoutes`);
const recordRoutes = require(`./routes/recordRoutes`);
const categoryRoutes = require(`./routes/categoryRoutes`);
const commentRoutes = require(`./routes/commentRoutes`);
const recordCategoryRoutes = require(`./routes/recordcategoryRoutes`);
const gameVersionRoutes = require(`./routes/gameversionRoutes`);
const authRoutes = require(`./routes/authRoutes`);

dotenv.config();

const app = express();  

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/gameversions',gameVersionRoutes);
app.use('/api/recordcategories',recordCategoryRoutes);
app.use('/api/auth', authRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Speedrun Website');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});