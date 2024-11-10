// routes/gameversionRoutes.js
const gameversionController = require(`../controllers/gameversionController`);
const express = require(`express`);
const {validateGameVersion, validateUpdateGameVersion, validateGameVersionId}
             = require(`../validators/gameversionDTO`);

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all game versions
 * @access Public
 * @returns {Array} List of game versions
 */
router.get('/', (req, res) => gameversionController.getAllGameVersions(req, res));

/**
 * @route GET /:id
 * @description Retrieve a game version by ID
 * @param {number} id - Game version ID
 * @access Public
 * @returns {Object} Game version details
 */
router.get('/:id', validateGameVersionId, (req, res) => gameversionController.getGameVersionById(req, res));

/**
 * @route GET /games/:id
 * @description Retrieve game versions by game ID
 * @param {number} id - Game ID
 * @access Public
 * @returns {Array} List of game versions for the specific game
 */
router.get('/games/:id', validateGameVersionId, (req, res) => gameversionController.getGameVersionByGameId(req, res));

/**
 * @route POST /
 * @description Create a new game version
 * @param {Object} req.body - Game version data
 * @access Admin
 * @returns {Object} The created game version
 */
router.post('/', validateGameVersion, (req, res) => gameversionController.createGameVersion(req, res));

/**
 * @route PUT /:id
 * @description Update an existing game version
 * @param {integer} id - Game version ID
 * @param {Object} req.body - Updated game version data
 * @access Admin
 * @returns {Object} Updated game version details
 */
router.put('/:id', validateUpdateGameVersion, (req, res) => gameversionController.updateGameVersion(req, res));

/**
 * @route DELETE /:id
 * @description Delete a game version by ID
 * @param {integer} id - Game version ID
 * @access Admin
 * @returns {Object} Success message
 */
router.delete('/:id', validateGameVersionId, (req, res) => gameversionController.deleteGameVersion(req, res));

module.exports = router;
