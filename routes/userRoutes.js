// routes/userRoutes.js
const userController = require(`../controllers/userController`);
const express = require(`express`);
const {validateUser, validateUpdateUser, validateUserId} = require(`../validators/userDTO`);
const upload = require('../middleware/fileUpload');

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all users
 * @access Public
 * @returns {Array} List of users
 */
router.get('/', (req, res) => userController.getAllUsers(req, res));

/**
 * @route GET /search
 * @description Search for users by a search term
 * @access Public
 * @returns {Array} List of matching users
 */
router.get('/search', (req, res) => userController.searchUser(req, res));

/**
 * @route GET /:id
 * @description Retrieve a user by username
 * @param {string} searchTerm - Username
 * @access Public
 * @returns {Object} User details
 */
router.get('/:id', validateUserId, (req, res) => userController.getUserById(req, res));

/**
 * @route POST /
 * @description Create a new user
 * @access Public
 * @param {Object} req.body - User data
 * @returns {Object} The created user
 */
router.post('/', (req, res) => userController.createUser(req, res));

/**
 * @route PUT /:id
 * @description Update user information
 * @param {integer} id - User ID
 * @access Public
 * @param {Object} req.body - Updated user data
 * @returns {Object} Updated user details
 */
//router.put('/:id', validateUpdateUser, (req, res) => userController.updateUser(req, res));
router.post('/:id/edit', validateUpdateUser, upload.single('profile_picture'), (req, res) => userController.updateUser(req, res));

/**
 * @route POST /login
 * @description Login a user
 * @param {Object} req.body - User credentials for login
 * @access Public
 * @returns {Object} Authentication token or error message
 */
router.post('/login', (req, res) => userController.login(req, res));

/**
 * @route DELETE /:id
 * @description Delete a user by ID
 * @param {integer} id - User ID
 * @access Public
 * @returns {Object} Success message
 */
router.get('/delete/:id', validateUserId, (req, res) => userController.deleteUser(req, res));

module.exports = router;

 