// validators/gameversionDTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new game version.
 * Validates the 'gameId' and 'name' fields.
 * 
 * @function
 * @name validateGameVersion
 * @returns {array} An array of validation middlewares.
 */
const validateGameVersion = [
  /**
   * Validates the 'gameId' field.
   * @name body('gameId')
   * @type {Validator}
   * @description Ensures 'gameId' is an integer and not empty.
   */
  body('gameId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('Id is required'),

  /**
   * Validates the 'name' field.
   * @name body('name')
   * @type {Validator}
   * @description Ensures 'name' is a string and not empty.
   */
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing game version.
 * Validates the 'name' field.
 * 
 * @function
 * @name validateUpdateGameVersion
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateGameVersion = [
  /**
   * Validates the 'name' field.
   * @name body('name')
   * @type {Validator}
   * @description Ensures 'name' is a string.
   */
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating a game version ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateGameVersionId
 * @returns {array} An array of validation middlewares.
 */
const validateGameVersionId = [
  /**
   * Validates the 'id' parameter to be an integer.
   * @name param('id')
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
  validateGameVersion,
  validateGameVersionId,
  validateUpdateGameVersion
};
