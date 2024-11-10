// routes/categoryRoutes.js
const categoryController = require(`../controllers/categoryController`);
const express = require(`express`);
const {validateCategory, validateUpdateCategory, validateCategoryId} = require(`../validators/categoryDTO`);

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all categories
 * @access Public
 * @returns {Array} List of categories
 */
router.get('/', (req, res) => categoryController.getAllCategories(req, res));

/**
 * @route GET /:id
 * @description Retrieve a category by ID
 * @param {number} id - Category ID
 * @access Public
 * @returns {Object} Category details
 */
router.get('/:id', validateCategoryId, (req, res) => categoryController.getCategoryById(req, res));

/**
 * @route GET /games/:id
 * @description Retrieve categories by game ID
 * @param {number} id - Game ID
 * @access Public
 * @returns {Array} List of categories for the game
 */
router.get('/games/:id', validateCategoryId, (req, res) => categoryController.getCategoryByGameId(req, res));

/**
 * @route POST /
 * @description Create a new category
 * @param {Object} req.body - Category data
 * @access Public
 * @returns {Object} The created category
 */
router.post('/', validateCategory, (req, res) => categoryController.createCategory(req, res));

/**
 * @route PUT /:id
 * @description Update a category by ID
 * @param {number} id - Category ID
 * @param {Object} req.body - Updated category data
 * @access Public
 * @returns {Object} Updated category details
 */
router.put('/:id', validateUpdateCategory, (req, res) => categoryController.updateCategory(req, res));

/**
 * @route DELETE /:id
 * @description Delete a category by ID
 * @param {number} id - Category ID
 * @access Public
 * @returns {Object} Success message
 */
router.delete('/:id', validateCategoryId, (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;
