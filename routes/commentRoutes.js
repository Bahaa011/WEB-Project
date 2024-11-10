// routes/commentRoutes.js
const commentController = require(`../controllers/commentController`);
const express = require(`express`);
const {validateComment, validateUpdateComment, validateCommentId} = require(`../validators/commentDTO`);

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all comments
 * @access Public
 * @returns {Array} List of comments
 */
router.get('/', (req, res) => commentController.getAllComments(req, res));

/**
 * @route GET /:id
 * @description Retrieve a comment by ID
 * @param {number} id - Comment ID
 * @access Public
 * @returns {Object} Comment details
 */
router.get('/:id', validateCommentId, (req, res) => commentController.getCommentById(req, res));

/**
 * @route GET /records/:id
 * @description Retrieve comments by record ID
 * @param {number} id - Record ID
 * @access Public
 * @returns {Array} List of comments for the record
 */
router.get('/records/:id', validateCommentId, (req, res) => commentController.getCommentsByRecordId(req, res));

/**
 * @route GET /users/:id
 * @description Retrieve comments by user ID
 * @param {number} id - User ID
 * @access Public
 * @returns {Array} List of comments by the user
 */
router.get('/users/:id', validateCommentId, (req, res) => commentController.getCommentsByUserId(req, res));

/**
 * @route POST /
 * @description Create a new comment
 * @param {Object} req.body - Comment data
 * @access Public
 * @returns {Object} The created comment
 */
router.post('/', validateComment, (req, res) => commentController.createComment(req, res));

/**
 * @route PUT /:id
 * @description Update a comment by ID
 * @param {integer} id - Comment ID
 * @param {Object} req.body - Updated comment data
 * @access Public
 * @returns {Object} Updated comment details
 */
router.put('/:id', validateUpdateComment, (req, res) => commentController.updateComment(req, res));

/**
 * @route DELETE /:id
 * @description Delete a comment by ID
 * @param {integer} id - Comment ID
 * @access Public
 * @returns {Object} Success message
 */
router.delete('/:id', validateCommentId, (req, res) => commentController.deleteComment(req, res));

module.exports = router;
