// server.js
const express = require('express');
const dotenv = require('dotenv');
const ejs = require("ejs");
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require(`./routes/gameRoutes`);
const recordRoutes = require(`./routes/recordRoutes`);
const categoryRoutes = require(`./routes/categoryRoutes`);
const commentRoutes = require(`./routes/commentRoutes`);
const recordCategoryRoutes = require(`./routes/recordcategoryRoutes`);
const gameVersionRoutes = require(`./routes/gameversionRoutes`);
const authRoutes = require(`./routes/authRoutes`);
const gameService = require('./services/gameService');

const authController = require('./controllers/authController');

dotenv.config();

const app = express();  

app.set('view engine', 'ejs');

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

const user = {
  username: 'JohnDoe',
    isAuthenticated: true,
}

app.use(express.static(path.join(__dirname, '/public')));

// Root route
app.get('/', (req, res) => {
  res.render('index', { user: user });
});

app.get('/games', async (req, res) => {
  // Example games array, this should come from your database or an API
  const games = await gameService.getAllGames();

  // Pass the games data to the view
  res.render('game', { title: 'Games', games: games });
});

app.get('/about', (req , res) => {
  res.render('about');
})

app.post('/register', async (req,res) => {
  await authController.register(req, res);
});

app.get('/register', (req, res) => {
  res.render('register'); // Render register page when visiting /register
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