// validators/gameDTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new game.
 * Validates the 'name', 'icon', 'date', 'rules', and 'dev' fields.
 * 
 * @function
 * @name validateGame
 * @returns {array} An array of validation middlewares.
 */
const validateGame = [
  /**
   * Validates the 'name' field.
   * @name body('name')
   * @type {Validator}
   * @description Ensures 'name' is a non-empty string.
   */
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),

  /**
   * Validates the 'icon' field.
   * @name body('icon')
   * @type {Validator}
   * @description Ensures 'icon' is a valid URL if provided.
   */
  body('icon')
    .optional()
    .isURL()
    .withMessage('Game icon must be a valid URL'),

  /**
   * Validates the 'date' field.
   * @name body('date')
   * @type {Validator}
   * @description Ensures 'date' is a valid date if provided.
   */
  body('date')
    .optional()
    .custom(value => {
      const datePattern = /^(\d{4}-\d{2}-\d{2}|[A-Za-z]+\s\d{1,2},\s\d{4})$/;
      return datePattern.test(value);
    }),

  /**
   * Validates the 'rules' field.
   * @name body('rules')
   * @type {Validator}
   * @description Ensures 'rules' is a non-empty string.
   */
  body('rules')
    .isString()
    .withMessage('Rules must be a string')
    .notEmpty()
    .withMessage('Rules is required'),

  /**
   * Validates the 'dev' field.
   * @name body('dev')
   * @type {Validator}
   * @description Ensures 'dev' is a string if provided.
   */
  body('dev')
    .optional()
    .isString()
    .withMessage('Developer must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing game.
 * Validates the 'name', 'icon', 'date', 'rules', and 'dev' fields, all of which are optional.
 * 
 * @function
 * @name validateUpdateGame
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateGame = [
  /**
   * Validates the 'name' field.
   * @name body('name')
   * @type {Validator}
   * @description Ensures 'name' is a non-empty string if provided.
   */
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string'),

  /**
   * Validates the 'icon' field.
   * @name body('icon')
   * @type {Validator}
   * @description Ensures 'icon' is a valid URL if provided.
   */
  body('icon')
    .optional()
    .isURL()
    .withMessage('Game icon must be a valid URL'),

  /**
   * Validates the 'date' field.
   * @name body('date')
   * @type {Validator}
   * @description Ensures 'date' is a valid date if provided.
   */
  body('date')
    .optional()
    .isDate()
    .withMessage('Release date must be a date'),

  /**
   * Validates the 'rules' field.
   * @name body('rules')
   * @type {Validator}
   * @description Ensures 'rules' is a string if provided.
   */
  body('rules')
    .optional()
    .isString()
    .withMessage('Rules must be a string'),

  /**
   * Validates the 'dev' field.
   * @name body('dev')
   * @type {Validator}
   * @description Ensures 'dev' is a string if provided.
   */
  body('dev')
    .optional()
    .isString()
    .withMessage('Developer must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating a game ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateGameId
 * @returns {array} An array of validation middlewares.
 */
const validateGameId = [
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
  validateGame,
  validateGameId,
  validateUpdateGame
};
