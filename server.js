// server.js
const express = require('express');
const dotenv = require('dotenv');
const ejs = require("ejs");
const path = require('path');
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require(`./routes/gameRoutes`);
const recordRoutes = require(`./routes/recordRoutes`);
const categoryRoutes = require(`./routes/categoryRoutes`);
const commentRoutes = require(`./routes/commentRoutes`);
const recordCategoryRoutes = require(`./routes/recordcategoryRoutes`);
const gameVersionRoutes = require(`./routes/gameversionRoutes`);
const gameService = require('./services/gameService');
const userService = require('./services/userService')

const userController = require('./controllers/userController');
const recordService = require('./services/recordService');

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

app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,             // Prevents saving session if unmodified
  saveUninitialized: false,  // Prevents storing uninitialized session
  cookie: {
      secure: false,         // Set to true if using HTTPS
      httpOnly: true,        // Prevents client-side JavaScript from accessing cookies
      maxAge: 3600000        // Session expiration time in milliseconds (1 hour)
  }
}));

// Middleware to make session accessible in views (optional)
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.redirect('/home'));

// Root route
app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/users', async (req, res) => {
  // Example games array, this should come from your database or an API
  const users = await userService.getAllUsers();

  // Pass the games data to the view
  res.render('user', { title: 'Users', users: users });
})

app.get('/games', async (req, res) => {
  // Example games array, this should come from your database or an API
  const games = await gameService.getAllGames();

  // Pass the games data to the view
  res.render('game', { title: 'Games', games: games });
});

app.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryId, versionId } = req.body;
  const game = await gameService.getGameById(id);

  const leaderboard = await recordService.getLeaderboardByFilters(id, {categoryId, versionId});

  res.render('gameDetails', {
    game: game,
    leaderboard: leaderboard // pass leaderboard data
  });
});

app.get('/createGame', async (req, res) => {
  res.render('create-game');
});

app.get('/about', (req , res) => {
  res.render('about');
})

app.get('/help', (req , res) => {
  res.render('help');
})

app.get('/register', (req, res) => {
  res.render('register'); // Render register page when visiting /register
});

app.get("/login",(req, res) => {
  res.render("login");
});

app.get("/signout", (req, res) => {
  res.clearCookie('token'); // Clear the authentication token cookie
  res.redirect('/home'); // Redirect to the main page or login page
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