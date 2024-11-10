// routes/recordcategoryRoutes.js
const RecordCategoryController = require(`../controllers/recordcategoryController`);
const express = require(`express`);
const {validateRecordCategory, validateUpdateRecordCategory, validateRecordCategoryId} 
                    = require(`../validators/recordcategoryDTO`);

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all record categories
 * @access Public
 * @returns {Array} List of record categories
 */
router.get('/', (req, res) => RecordCategoryController.getAllRecordCategories(req, res));

/**
 * @route GET /:id
 * @description Retrieve a record category by ID
 * @param {string} id - Record category ID
 * @access Public
 * @returns {Object} Record category details
 */
router.get('/:id', validateRecordCategoryId, (req, res) => RecordCategoryController.getRecordCategoryById(req, res));

/**
 * @route POST /
 * @description Create a new record category
 * @param {Object} req.body - Record category data
 * @access Public
 * @returns {Object} The created record category
 */
router.post('/', validateRecordCategory, (req, res) => RecordCategoryController.createRecordCategory(req, res));

/**
 * @route PUT /:id
 * @description Update an existing record category
 * @param {integer} id - Record category ID
 * @param {Object} req.body - Updated record category data
 * @access Public
 * @returns {Object} Updated record category details
 */
router.put('/:id', validateUpdateRecordCategory, (req, res) => RecordCategoryController.updateRecordCategory(req, res));

/**
 * @route DELETE /:id
 * @description Delete a record category by ID
 * @param {integer} id - Record category ID
 * @access Public
 * @returns {Object} Success message
 */
router.delete('/:id', validateRecordCategoryId, (req, res) => RecordCategoryController.deleteRecordCategory(req, res));

module.exports = router;
