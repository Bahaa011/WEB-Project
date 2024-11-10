// validators/recordDTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new speedrun record.
 * Validates the 'userId', 'gameId', 'versionId', 'time', 'url', and 'notes' fields.
 * 
 * @function
 * @name validateRecord
 * @returns {Array} An array of validation middleware functions to be used in the route handler.
 */
const validateRecord = [
  /**
   * Validates the 'userId' field.
   * @name body('userId')
   * @type {Validator}
   * @description Ensures 'userId' is a non-empty integer.
   */
  body('userId')
    .isInt()
    .withMessage('Id must be an integer')
    .notEmpty()
    .withMessage('User id is required'),
  /**
   * Validates the 'gameId' field.
   * @name body('gameId')
   * @type {Validator}
   * @description Ensures 'gameId' is a non-empty integer.
   */
  body('gameId')
    .isInt()
    .withMessage('Id must be an integer')
    .notEmpty()
    .withMessage('Game id is required'),
  /**
   * Validates the 'versionId' field.
   * @name body('versionId')
   * @type {Validator}
   * @description Ensures 'versionId' is a non-empty integer.
   */
  body('versionId')
    .isInt()
    .withMessage('Id must be an integer')
    .notEmpty()
    .withMessage('Version id is required'),
  /**
   * Validates the 'time' field.
   * @name body('time')
   * @type {Validator}
   * @description Ensures 'time' is a date.
   */
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/)
    .withMessage('Record time must be of format HH:MM:SS')
    .notEmpty()
    .withMessage('record time is required'),
  /**
   * Validates the 'url' field.
   * @name body('url')
   * @type {Validator}
   * @description Ensures 'url' is a valid URL.
   */
  body('url')
    .isURL()
    .withMessage('Must be a valid URL')
    .notEmpty()
    .withMessage('URL is required'),
  /**
   * Validates the 'notes' field.
   * @name body('notes')
   * @type {Validator}
   * @description Ensures 'notes' is a string if provided.
   */
  body('notes')
    .optional()
    .isString()
    .withMessage('Must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing speedrun record.
 * Validates the 'versionId', 'time', 'url', 'status', and 'notes' fields, all of which are optional.
 * 
 * @function
 * @name validateUpdateRecord
 * @returns {Array} An array of validation middleware functions to be used in the route handler.
 */
const validateUpdateRecord = [
  /**
   * Validates the 'versionId' field.
   * @name body('versionId')
   * @type {Validator}
   * @description Ensures 'versionId' is an integer if provided.
   */
  body('versionId')
    .optional()
    .isInt()
    .withMessage('Id must be an integer'),
  /**
   * Validates the 'time' field.
   * @name body('time')
   * @type {Validator}
   * @description Ensures 'time' is a date if provided.
   */
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/)
    .withMessage('Record time must be of format HH:MM:SS'),
  /**
   * Validates the 'url' field.
   * @name body('url')
   * @type {Validator}
   * @description Ensures 'url' is a valid URL if provided.
   */
  body('url')
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  /**
   * Validates the 'status' field.
   * @name body('status')
   * @type {Validator}
   * @description Ensures 'status' is either Pending, Approved or Rejected if provided.
   */
  body('status')
    .optional()
    .isIn(['Pending', 'Approved', 'Rejected'])
    .withMessage('Status must be one of the following: Pending, Approved, or Rejected'),
  /**
   * Validates the 'notes' field.
   * @name body('notes')
   * @type {Validator}
   * @description Ensures 'notes' is a string if provided.
   */
  body('notes')
    .optional()
    .isString()
    .withMessage('Must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating the 'id' parameter in a URL.
 * Ensures that the 'id' is an integer.
 * 
 * @function
 * @name validateRecordId
 * @returns {Array} An array of validation middleware functions to be used in the route handler.
 */
const validateRecordId = [
  /**
   * Validates the 'id' field.
   * @name body('id')
   * @type {Validator}
   * @description Ensures 'id' is an integer.
   */
  param('id').isInt().withMessage('ID must be an integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRecord,
  validateRecordId,
  validateUpdateRecord
};
