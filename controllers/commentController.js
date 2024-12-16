// controllers/commentController.js
const commentService = require('../services/commentService');

/**
 * Controller class for handling comment-related requests.
 * Provides methods for retrieving, creating, updating, and deleting comments.
 * @class
 */

class CommentController {    
    /**
     * Handles the request for getting all comments.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all comments.
     * @returns {Object} JSON response containing the list of all comments.
     */
    async getAllComments(req, res) {
        try {
            const comments = await commentService.getAllComments();
            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a comment by its ID.
     * @async
     * @param {Object} req - The request object containing the comment ID.
     * @param {Object} res - The response object containing the comment details.
     * @returns {Object} JSON response containing the requested comment.
     */
    async getCommentById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const comment = await commentService.getCommentById(id);

            res.json(comment);
        } catch (error) {
            if(error.message.includes('Comment not found')){
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting comments by record ID.
     * @async
     * @param {Object} req - The request object containing the record ID.
     * @param {Object} res - The response object containing the comments for the specified record.
     * @returns {Object} JSON response containing the list of comments for the specified record.
     */
    async getCommentsByRecordId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const comments = await commentService.getCommentsByRecordId(id);
                
            res.json(comments);
        } catch (error) {
            if(error.message.includes('Comments not found')){
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting comments by user ID.
     * @async
     * @param {Object} req - The request object containing the user ID.
     * @param {Object} res - The response object containing the comments by the specified user.
     * @returns {Object} JSON response containing the list of comments by the specified user.
     */

    async getCommentsByUserId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const comments = await commentService.getCommentsByUserId(id);
                
            res.json(comments);
        } catch (error) {
            if(error.message.includes('Comments not found')){
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for creating a new comment.
     * @async
     * @param {Object} req - The request object containing the comment data.
     * @param {Object} res - The response object containing the created comment.
     * @returns {Object} JSON response containing the newly created comment.
     */
    async createComment(req, res) {
        try {
            const {recordId, userId, comment} = req.body;

            const newComment = await commentService.createComment({ recordId, userId, comment });

            res.redirect('/games');
        } catch (error) {
            res.redirect('/games');
        }
    }

    /**
     * Handles the request for updating an existing comment.
     * @async
     * @param {Object} req - The request object containing the comment ID and the updated comment data.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateComment(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { comment } = req.body;
            if (!comment) {
                return res.status(400).json({ message: 'No comment to update' });
            }
            const success = await commentService.updateComment(id, { comment });
            if (!success) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json({ message: 'Comment updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a comment.
     * @async
     * @param {Object} req - The request object containing the comment ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the delete operation.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteComment(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await commentService.deleteComment(id);
            if (!success) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CommentController();
