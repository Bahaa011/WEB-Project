// models/userModel.js

const moment = require('moment');

/**
 * Represents a user in the system.
 * @class
 */
class User {
    /**
     * Creates an instance of a User.
     * 
     * @constructor
     * @param {number} id - The unique identifier for the user.
     * @param {string} username - The user's username.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's hashed password.
     * @param {string} profile_picture - The URL of the user's profile picture.
     * @param {string} bio - The user's bio.
     * @param {string} createdAt - The timestamp when the user was created.
     * @param {string} updatedAt - The timestamp when the user's information was last updated.
     */
    constructor(id, username, email, password, profile_picture, bio, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile_picture = profile_picture;
        this.bio = bio;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Creates a new User instance from a database row.
     * This method maps the database row to a User object.
     * 
     * @static
     * @param {Object} row - The database row object.
     * @param {number} row.user_id - The user's unique identifier.
     * @param {string} row.username - The user's username.
     * @param {string} row.email - The user's email address.
     * @param {string} row.password - The user's hashed password.
     * @param {string} row.profile_picture_url - The URL of the user's profile picture.
     * @param {string} row.bio - The user's bio.
     * @param {string} row.created_at - The timestamp when the user was created.
     * @param {string} row.updated_at - The timestamp when the user's information was last updated.
     * @returns {User} A new instance of the User class.
     */
    static fromRow(row) {
        return new User(
            row.user_id,
            row.username,
            row.email,
            row.password,
            row.profile_picture_url,
            row.bio,
            moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
            moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        );
    }
}

module.exports = User;
