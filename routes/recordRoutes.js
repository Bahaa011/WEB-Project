// routes/recordRoutes.js
const recordController = require(`../controllers/recordController`);
const express = require(`express`);
const {validateRecord, validateUpdateRecord, validateRecordId} = require(`../validators/recordDTO`);
const upload = require('../middleware/fileUpload');

const router = express.Router();

// Define routes

/**
 * @route GET /
 * @description Retrieve all records
 * @access Public
 * @returns {Array} List of records
 */
router.get('/', (req, res) => recordController.getAllRecords(req, res));

/**
 * @route GET /:id
 * @description Retrieve a record by record_id
 * @param {number} id - Record ID
 * @access Public
 * @returns {Object} Record details
 */
router.get('/:id', validateRecordId,(req, res) => recordController.getRecordById(req, res));

/**
 * @route GET /:id/filter
 * @description Retrieve a leaderboard of records filtered by various criteria.
 * @param {number} id - Record ID to filter results.
 * @access Public
 * @returns {Array} List of filtered records
 */
router.get('/:id/filter',validateRecordId,(req,res) => recordController.getLeaderboardByFilters(req, res));

/**
 * @route POST /
 * @description Create a new record
 * @body {Object} record - Record details to be created (e.g., username, game, time)
 * @access Public
 * @returns {Object} The created record
 */
router.post('/', upload.single('url'),(req, res) => recordController.createRecord(req, res));

/**
 * @route PUT /:id
 * @description Update an existing record by record_id
 * @param {number} id - Record ID
 * @body {Object} record - Updated record details (e.g., username, game, time)
 * @access Admin
 * @returns {Object} Updated record details
 */
router.put('/:id', validateUpdateRecord,(req, res) => recordController.updateRecord(req, res));

/**
 * @route PUT /:id/approve
 * @description Approve a pending record submission
 * @param {number} id - Record ID
 * @access Admin
 * @returns {Object} Confirmation of record approval
 */
router.post('/:id/approve',(req, res) => recordController.approveRecord(req, res));

/**
 * @route PUT /:id/reject
 * @description Reject a pending record submission
 * @param {number} id - Record ID
 * @access Admin
 * @returns {Object} Confirmation of record rejection
 */
router.post('/:id/reject',(req, res) => recordController.rejectRecord(req, res));

/**
 * @route DELETE /:id
 * @description Delete a record by record_id
 * @param {number} id - Record ID
 * @access Admin
 * @returns {Object} Confirmation of record deletion
 */
router.delete('/:id',validateRecordId, (req, res) => recordController.deleteRecord(req, res));

module.exports = router;