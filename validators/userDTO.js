// validators/DTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new user.
 * Validates the 'username', 'email', 'password', 'profile_picture', and 'bio' fields.
 * 
 * @function
 * @name validateUser
 * @returns {array} An array of validation middlewares.
 */
const validateUser = [
  /**
   * Validates the 'username' field.
   * @name body('username')
   * @type {Validator}
   * @description Must be a non-empty string.
   */
  body('username')
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username is required'),

  /**
   * Validates the 'email' field.
   * @name body('email')
   * @type {Validator}
   * @description Must be a valid email address.
   */
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),

  /**
   * Validates the 'password' field.
   * @name body('password')
   * @type {Validator}
   * @description Must be at least 8 characters long.
   */
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .notEmpty()
    .withMessage('Password is required'),

  /**
   * Validates the 'profile_picture' field.
   * @name body('profile_picture')
   * @type {Validator}
   * @description Must be a valid URL if provided.
   */
  body('profile_picture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),

  /**
   * Validates the 'bio' field.
   * @name body('bio')
   * @type {Validator}
   * @description Must be a string if provided.
   */
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing user.
 * Validates the 'username', 'email', 'password', 'profile_picture', and 'bio' fields, all of which are optional.
 * 
 * @function
 * @name validateUpdateUser
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateUser = [
  /**
   * Validates the 'username' field.
   * @name body('username')
   * @type {Validator}
   * @description Must be a string if provided.
   */
  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username is required'),

  /**
   * Validates the 'email' field.
   * @name body('email')
   * @type {Validator}
   * @description Must be a valid email if provided.
   */
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),

  /**
   * Validates the 'password' field.
   * @name body('password')
   * @type {Validator}
   * @description Must be at least 8 characters if provided.
   */
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .notEmpty()
    .withMessage('Password is required'),

  /**
   * Validates the 'profile_picture' field.
   * @name body('profile_picture')
   * @type {Validator}
   * @description Must be a valid URL if provided.
   */
  body('profile_picture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),

  /**
   * Validates the 'bio' field.
   * @name body('bio')
   * @type {Validator}
   * @description Must be a string if provided.
   */
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating a user ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateUserId
 * @returns {array} An array of validation middlewares.
 */
const validateUserId = [
  /**
   * Validates the 'id' parameter to be an integer.
   * @name param('id')
   * @type {Validator}
   * @description Must be an integer.
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
  validateUser,
  validateUpdateUser,
  validateUserId
};
