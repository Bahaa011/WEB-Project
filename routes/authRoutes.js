// routes/authRoutes.js
const authController = require(`../controllers/authController`);
const express = require(`express`);
const {validateUser} = require(`../validators/userDTO`);

const router = express.Router();

/**
 * @route POST /register
 * @description Register a new user
 * @param {Object} req.body - User data for registration
 * @access Public
 * @returns {Object} Registration success message or error
 */
router.post('/register', validateUser, (req, res) => authController.register(req, res));

/**
 * @route POST /login
 * @description Login a user
 * @param {Object} req.body - User credentials for login
 * @access Public
 * @returns {Object} Authentication token or error message
 */
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;
