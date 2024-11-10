// models/commentModel.js

/**
 * Represents a Comment associated with a speedrun record.
 * @class
 */
class Comment{
    /**
     * Creates an instance of Comment.
     * @param {number} id - The unique identifier for the Comment.
     * @param {number} recordId - The unique identifier for the associated record.
     * @param {number} userId - The unique identifier for the user who made the comment.
     * @param {string} comment - The content of the comment.
     * @param {string} createdAt - The timestamp when the comment was created.
     * @param {string} updatedAt - The timestamp when the comment was last updated.
     */
    constructor(id, recordId, userId, comment, createdAt, updatedAt){
        this.id = id;
        this.recordId = recordId;
        this.userId = userId;
        this.comment = comment
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Creates a new Comment instance from a database row.
     * This method maps the database row to a Comment object.
     * 
     * @param {Object} row - The database row representing the Comment.
     * @param {number} row.comment_id - The unique ID for the Comment.
     * @param {number} row.record_id - The ID of the associated record.
     * @param {number} row.user_id - The ID of the user who made the comment.
     * @param {string} row.comment_text - The content of the comment.
     * @param {string} row.created_at - The timestamp when the comment was created.
     * @param {string} row.updated_at - The timestamp when the comment was last updated.
     * @returns {Comment} - A new instance of Comment.
     */
    static fromRow(row){
        return new Comment(
            row.comment_id,
            row.record_id,
            row.user_id,
            row.comment_text,
            row.created_at,
            row.updated_at
        )
    }
}

module.exports = Comment;