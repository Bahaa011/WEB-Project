// controllers/recordcategoryController.js
const recordCategoryService = require('../services/recordcategoryService');

/**
 * Controller class for handling record category-related requests.
 * Provides methods for retrieving, creating, updating, and deleting record categories.
 * @class
 */
class RecordCategoryController {
    /**
     * Handles the request for getting all record categories.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all record categories.
     * @returns {Object} JSON response containing the list of all record categories.
     */
    async getAllRecordCategories(req, res) {
        try {
            const categories = await recordCategoryService.getAllRecordCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a record category by its ID.
     * @async
     * @param {Object} req - The request object containing the record category ID.
     * @param {Object} res - The response object containing the record category details.
     * @returns {Object} JSON response containing the requested record category.
     */
    async getRecordCategoryById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await recordCategoryService.getRecordCategoryById(id);

            res.json(category);
        } catch (error) {
            if(error.message.includes('Record category not found')){
                return res.status(404).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for creating a new record category.
     * @async
     * @param {Object} req - The request object containing the record ID and category ID.
     * @param {Object} res - The response object containing the newly created record category.
     * @returns {Object} JSON response containing the created record category's details.
     */
    async createRecordCategory(req, res) {
        try {
            const {recordId, categoryId} = req.body;

            const newRecord = await recordCategoryService.createRecordCategory({ recordId, categoryId });
            res.status(201).json(newRecord);
        } catch (error) {
            if(error.message.includes('id is invalid')){
                return res.status(400).json({message: error.message});
            } else if(error.message.includes('Record and Category')){
                return res.status(400).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for updating an existing record category.
     * @async
     * @param {Object} req - The request object containing the record category ID and the new category data.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateRecordCategory(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { categoryId } = req.body;
            if (!categoryId) {
                return res.status(400).json({ message: 'No category to update' });
            }
            const success = await recordCategoryService.updateRecordCategory(id, { categoryId });
            if (!success) {
                return res.status(404).json({ message: 'Record Category not found' });
            }
            res.json({ message: 'Record Category updated successfully' });
        } catch (error) {
            if(error.message.includes('is invalid')){
                return res.status(400).json({message: error.message});
            } else if(error.message.includes('Record and Category')){
                return res.status(400).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a record category.
     * @async
     * @param {Object} req - The request object containing the record category ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the deletion.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteRecordCategory(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await recordCategoryService.deleteRecordCategory(id);
            if (!success) {
                return res.status(404).json({ message: 'Record Category not found' });
            }
            res.json({ message: 'Record Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new RecordCategoryController();
