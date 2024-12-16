// controllers/categoryController.js
const categoryService = require('../services/categoryService');

/**
 * Controller class for handling category-related requests.
 * Provides methods for retrieving, creating, updating, and deleting categories.
 * @class
 */

class CategoryController {
    /**
     * Handles the request for getting all categories.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all categories.
     * @returns {Object} JSON response containing the list of all categories.
     */
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a category by its ID.
     * @async
     * @param {Object} req - The request object containing the category ID.
     * @param {Object} res - The response object containing the category details.
     * @returns {Object} JSON response containing the requested category.
     */
    async getCategoryById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await categoryService.getCategoryById(id);

            res.json(category);
        } catch (error) {
            if(error.message.includes('Category not found')){
                return res.status(404).json({ message: error.message }); 
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a category by its associated game ID.
     * @async
     * @param {Object} req - The request object containing the game ID.
     * @param {Object} res - The response object containing the category for the specified game.
     * @returns {Object} JSON response containing the category for the specified game.
     */
    async getCategoryByGameId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await categoryService.getCategoryByGameId(id);

            res.json(category);
        } catch (error) {
            if(error.message.includes('Category not found')){
                res.status(404).json({ message: error.message }); 
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for creating a new category.
     * @async
     * @param {Object} req - The request object containing the category data.
     * @param {Object} res - The response object containing the created category.
     * @returns {Object} JSON response containing the newly created category.
     */
    async createCategory(req, res) {
        try {
            const {gameId, name, desc} = req.body;

            const newCategory = await categoryService.createCategory({ gameId, name, desc });
            res.redirect('/games');
        } catch (error) {
            res.render('game', { error: 'Failed to create the game version. Please try again.' });
        }
    }

    /**
     * Handles the request for updating an existing category.
     * @async
     * @param {Object} req - The request object containing the category ID and the updated data.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateCategory(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name, desc } = req.body;
            if (!name && !desc) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            const success = await categoryService.updateCategory(id, { name, desc });
            if (!success) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a category.
     * @async
     * @param {Object} req - The request object containing the category ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the delete operation.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteCategory(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await categoryService.deleteCategory(id);
            if (!success) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CategoryController();
