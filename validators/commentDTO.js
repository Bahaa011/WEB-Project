// validators/commentDTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new comment.
 * Validates the 'recordId', 'userId', and 'comment' fields.
 * 
 * @function
 * @name validateComment
 * @returns {array} An array of validation middlewares.
 */
const validateComment = [
  /**
   * Validates the 'recordId' field.
   * @name body('recordId')
   * @type {Validator}
   * @description Ensures 'recordId' is a non-empty integer.
   */
  body('recordId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('Record id is required'),

  /**
   * Validates the 'userId' field.
   * @name body('userId')
   * @type {Validator}
   * @description Ensures 'userId' is a non-empty integer.
   */
  body('userId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('User id is required'),

  /**
   * Validates the 'comment' field.
   * @name body('comment')
   * @type {Validator}
   * @description Ensures 'comment' is a non-empty string.
   */
  body('comment')
    .isString()
    .withMessage('Comment must be a string')
    .notEmpty()
    .withMessage('Comment is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating an existing comment.
 * Validates the 'comment' field.
 * 
 * @function
 * @name validateUpdateComment
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateComment = [
  /**
   * Validates the 'comment' field.
   * @name body('comment')
   * @type {Validator}
   * @description Ensures 'comment' is a string.
   */
  body('comment')
    .isString()
    .withMessage('Comment must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating a comment ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateCommentId
 * @returns {array} An array of validation middlewares.
 */
const validateCommentId = [
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
  validateComment,
  validateCommentId,
  validateUpdateComment
};
