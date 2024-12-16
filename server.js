// server.js
const express = require('express');
const dotenv = require('dotenv');
const ejs = require("ejs");
const path = require('path');
const bodyParser = require("body-parser");
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

const recordService = require('./services/recordService');
const gameversionService = require('./services/gameversionService');
const categoryService = require('./services/categoryService');
const commentService = require('./services/commentService');

dotenv.config();

const app = express();  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json()); // Parses JSON data

app.use(session({
  secret: 'your-secret-key',  // Replace with a strong secret
  resave: false,              // Don't resave sessions if they are not modified
  saveUninitialized: true,    // Save a session even if it's uninitialized
  cookie: { secure: false }   // Set to true in production with HTTPS enabled
}));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/gameversions',gameVersionRoutes);
app.use('/api/recordcategories',recordCategoryRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.redirect('/home'));

// Root route
app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/users', async (req, res) => {
  // Example games array, this should come from your database or an API
  const users = await userService.getAllUsers();

  // Pass the games data to the view
  res.render('user', { title: 'Users', users: users, loggedUser: req.session.user });
})

app.get('/profile/edit/:id', async (req, res) => {
  res.render('edit-user', {user: req.session.user});
})

app.get('/games', async (req, res) => {
  // Example games array, this should come from your database or an AP
  const games = await gameService.getAllGames();

  // Pass the games data to the view
  res.render('game', { title: 'Games', games: games });
});

app.get('/profile', async (req,res) => {
  if(!req.session.user){
    return res.redirect('/');
  }
  res.render('profile', {user: req.session.user, loggedUser: req.session.user});
})

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.render('profile', {user: user, loggedUser: req.session.user});
});

app.get('/games/create', async (req, res) => {
  res.render('create-game');
});

app.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryId, versionId } = req.body;
  const game = await gameService.getGameById(id);

  const leaderboard = await recordService.getLeaderboardByFilters(id, {categoryId, versionId});

  res.render('gameDetails', {
    gameId: id,
    game: game,
    leaderboard: leaderboard // pass leaderboard data
  });
});

app.get('/addRecord/:id', async(req, res) => {
  const versions = await gameversionService.getGameVersionByGameId(req.params.id);

  if(!req.session.user){
    return res.redirect('/login');
  }

    res.render('add-record', {
      gameId: req.params.id,  // gameId should be a single value
      userId: req.session.user.id,  // assuming req.session.user is set correctly
      gameversions: versions,
    });
});

app.get('/record/category/:recordId/game/:gameId', async(req, res) => {
  const {recordId, gameId} = req.params;

  const categories = await categoryService.getCategoryByGameId(gameId);

  res.render('add-record-category', {recordId: recordId, categories: categories})
})

app.get('/comments', async (req, res) => {
  const recordId = req.query.recordId;

  const comments = await commentService.getCommentsByRecordId(recordId);

  res.render('comment', {comments: comments, user: req.session.user, recordId: recordId});
})

app.get('/addVersion/:id', async (req, res) => {
  const { id } = req.params;
  res.render('add-version', {gameId: id});
})

app.get('/addCategory/:id', async (req, res) => {
  const { id } = req.params;
  res.render('add-category', {gameId: id});
})

app.get('/about', (req , res) => {  
  res.render('about');
})

app.get('/help',(req , res) => {
  res.render('help');
})

app.get('/register', (req, res) => {
  res.render('register'); // Render register page when visiting /register
});

app.get("/login",(req, res) => {
  res.render("login");
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.redirect('/'); // Optional: Redirect to the homepage even if an error occurs
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/login'); // Redirect to the login page or any other desired page
  });
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