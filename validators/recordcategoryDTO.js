// validators/recordcategoryDTO.js
const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating or associating a record with a category.
 * Validates the 'recordId' and 'categoryId' fields.
 * 
 * @function
 * @name validateRecordCategory
 * @returns {array} An array of validation middlewares.
 */
const validateRecordCategory = [
  /**
   * Validates the 'recordId' field.
   * @name body('recordId')
   * @type {Validator}
   * @description Ensures the 'recordId' is an integer and not empty.
   */
  body('recordId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('Id is required'),

  /**
   * Validates the 'categoryId' field.
   * @name body('categoryId')
   * @type {Validator}
   * @description Ensures the 'categoryId' is an integer and not empty.
   */
  body('categoryId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('Id is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for updating the record-category association.
 * Validates the 'categoryId' field.
 * 
 * @function
 * @name validateUpdateRecordCategory
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateRecordCategory = [
  /**
   * Validates the 'categoryId' field.
   * @name body('categoryId')
   * @type {Validator}
   * @description Ensures the 'categoryId' is an integer and not empty.
   */
  body('categoryId')
    .isInt()
    .withMessage('Id must be integer')
    .notEmpty()
    .withMessage('Id is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validation middleware for validating a record-category ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateRecordCategoryId
 * @returns {array} An array of validation middlewares.
 */
const validateRecordCategoryId = [
  /**
   * Validates the 'id' parameter to be an integer.
   * @name param('id')
   * @type {Validator}
   * @description Ensures the 'id' is an integer.
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
  validateRecordCategory,
  validateRecordCategoryId,
  validateUpdateRecordCategory
};
