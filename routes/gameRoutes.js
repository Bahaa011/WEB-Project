// routes/gameRoutes.js
const gameController = require(`../controllers/gameController`);
const express = require(`express`);
const {validateGame, validateUpdateGame, validateGameId} = require(`../validators/gameDTO`);
const upload = require('../middleware/fileUpload');

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all games
 * @access Public
 * @returns {Array} List of games
 */
router.get('/', (req, res) => gameController.getAllGames(req, res));

/**
 * @route GET /search
 * @description Search for games by a search term
 * @access Public
 * @returns {Array} List of matching games
 */
router.get('/search', (req, res) => gameController.searchGame(req, res));

/**
 * @route GET /:id
 * @description Retrieve a game by ID
 * @param {string} searchTerm - Game name
 * @access Public
 * @returns {Object} Game details
 */
router.get('/:id', validateGameId, (req, res) => gameController.getGamebyId(req, res));

/**
 * @route POST /
 * @description Create a new game
 * @param {Object} req.body - Game data
 * @access Admin
 * @returns {Object} The created game
 */
router.post('/', upload.single('icon'), (req, res) => gameController.createGame(req, res));

/**
 * @route PUT /:id
 * @description Update an existing game
 * @param {number} id - Game ID
 * @param {Object} req.body - Updated game data
 * @access Admin
 * @returns {Object} Updated game details
 */
router.put('/:id', validateUpdateGame, (req, res) => gameController.updateGame(req, res));

/**
 * @route DELETE /:id
 * @description Delete a game by ID
 * @param {number} id - Game ID
 * @access Public
 * @returns {Object} Success message
 */
router.get('/:id/delete', validateGameId, (req, res) => gameController.deleteGame(req, res));

module.exports = router;
