// services/commentService.js
const { initDB } = require(`../config/database`);
const Comment = require(`../models/commentModel`);

class CommentService{
    /**
     * Initializes a new instance of the recordService class.
     * @constructor
     */
    constructor(){
        this.pool = null;
        this.init();
    }

    /**
     * Initialize database connection pool
     * @async
     */
    async init(){
        this.pool = await initDB();
    }

    /**
     * Retrieve all comments
     * @async
     * @returns {Array} List of all comments
     * @throws {Error} Throws error if database query fails
     */
    async getAllComments(){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM comments;`);
            return rows.map(Comment.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieve a comment by its ID
     * @async
     * @param {number} id - The comment ID
     * @returns {Object} The comment details
     * @throws {Error} Throws error if comment not found or database query fails
     */
    async getCommentById(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM comments WHERE comment_id = ?`,[id]);
            if (rows.length === 0) throw new Error('Comment not found');
            return Comment.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Retrieve comments by record ID
     * @async
     * @param {number} recordId - The record ID
     * @returns {Array} List of comments associated with the given record ID
     * @throws {Error} Throws error if no comments found or database query fails
     */
    async getCommentsByRecordId(recordId){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM comments WHERE record_id = ?`,[recordId]);
            if (rows.length === 0) throw new Error('Comments not found');;
            return rows.map(Comment.fromRow);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Retrieve comments by user ID
     * @async
     * @param {number} userId - The user ID
     * @returns {Array} List of comments made by the user
     * @throws {Error} Throws error if no comments found or database query fails
     */
    async getCommentsByUserId(userId){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM comments WHERE user_id = ?`,[userId]);
            if (rows.length === 0) throw new Error('Comments not found');;
            return rows.map(Comment.fromRow);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Create a new comment
     * @async
     * @param {Object} commentData - The comment data
     * @param {number} commentData.recordId - The record ID to associate the comment with
     * @param {number} commentData.userId - The user ID of the commenter
     * @param {string} commentData.comment - The text of the comment
     * @returns {Object} The created comment with its details
     * @throws {Error} Throws error if record or user IDs are invalid, or if database query fails
     */
    async createComment(commentData){
        try{
            const {recordId, userId, comment} = commentData;

            const [checkRecordId] = await this.pool.query
                (`SELECT * FROM records WHERE record_id = ?`,[recordId]);
            if(checkRecordId.length === 0) throw new Error('Record id is invalid');

            const [checkUserId] = await this.pool.query
                (`SELECT * FROM users WHERE user_id = ?`,[userId]);
            if(checkUserId.length === 0) throw new Error('User id is invalid');
            

            const [result] = await this.pool.query
            (`INSERT INTO comments (record_id ,user_id, comment_text, created_at, updated_at)
                 VALUES (?, ?, ?, NOW(), NOW())`,[recordId, userId, comment]);

            const [createdComment] = await this.pool.query
            (`SELECT comment_id AS id, record_id, user_id, comment_text, created_at, updated_at
                FROM comments WHERE comment_id = ?`,
                [result.insertId]
                );
        
            return createdComment[0];
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Update an existing comment by ID
     * @async
     * @param {number} id - The comment ID
     * @param {Object} commentData - The updated comment data
     * @param {string} commentData.comment - The new text of the comment
     * @returns {boolean} True if the comment was updated successfully, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async updateComment(id, commentData) {
        try {
            const {comment} = commentData;
            const [result] = await this.pool.query(
                'UPDATE comments SET comment_text = ?, updated_at = NOW() WHERE comment_id = ?',
                [comment, id]
              );
              return result.affectedRows > 0;
        } catch (error) {
            throw new Error(error); // Throw a more generic error message
        }
    }

    /**
     * Delete a comment by ID
     * @async
     * @param {number} id - The comment ID
     * @returns {boolean} True if the comment was deleted successfully, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async deleteComment(id){
        try{
            const[result] = await this.pool.query(`DELETE FROM comments WHERE comment_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new CommentService();