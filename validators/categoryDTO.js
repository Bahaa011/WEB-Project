// validators/categoryValidator.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new category.
 * Validates the 'gameId', 'name', and 'desc' fields.
 * 
 * @function
 * @name validateCategory
 * @returns {array} An array of validation middlewares.
 */
const validateCategory = [
  /**
   * Validates the 'gameId' field.
   * @name body('gameId')
   * @type {Validator}
   * @description Ensures 'gameId' is a non-empty integer.
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
   * @description Ensures 'name' is a non-empty string.
   */  
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),
  /**
   * Validates the 'desc' field.
   * @name body('desc')
   * @type {Validator}
   * @description Ensures 'desc' is a non-empty string if provided.
   */  
  body('desc')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Description is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing category.
 * Validates the 'name' and 'desc' fields, all of which are optional.
 * 
 * @function
 * @name validateUpdateCategory
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateCategory = [
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
     * Validates the 'desc' field.
     * @name body('desc')
     * @type {Validator}
     * @description Ensures 'desc' is a non-empty string if provided.
    */
    body('desc')
      .optional()
      .isString()
      .withMessage('Description must be a string'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];


/**
 * Validation middleware for validating a category ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateCategoryId
 * @returns {array} An array of validation middlewares.
 */
const validateCategoryId = [
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
  validateCategory,
  validateCategoryId,
  validateUpdateCategory
};
