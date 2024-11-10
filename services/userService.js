// services/userService.js
const { initDB } = require(`../config/database`);
const User = require(`../models/userModel`);
const bcrypt = require(`bcrypt`);


/**
 * UserService handles all user-related operations, including CRUD actions
 * for managing users in the database.
 */
class UserService{
     /**
     * Initializes a new instance of the UserService class.
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
     * Retrieves all users from the database.
     * @async
     * @returns {Array} An array of User objects.
     * @throws {Error} If there is an error querying the database.
     */
    async getAllUsers(){
        try{
            const [rows] = await this.pool.query
            (`SELECT user_id , username, email, profile_picture_url, bio, created_at, updated_at
                    FROM users;`);
            return rows.map(User.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieves a user by their ID.
     * @async
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Object} The User object if found.
     * @throws {Error} If the user is not found or there is an error querying the database.
     */
    async getUserById(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT user_id, username, email, profile_picture_url, bio, created_at, updated_at 
                FROM users WHERE user_id = ?;`,[id]);
            if (rows.length === 0) throw new Error('User not found');
            return User.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Searches for users by their username.
     * @async
     * @param {Object} options - The search options.
     * @param {string} options.searchTerm - The term to search for in usernames.
     * @returns {Array} An array of matching User objects.
     * @throws {Error} If no users are found or there is an error querying the database.
     */
    async searchUser({searchTerm}){
        try{
            const query = `SELECT user_id AS id , username, email,
             profile_picture_url, bio, created_at, updated_at 
             FROM users 
             WHERE username LIKE ?`;

            const values = [`%${searchTerm}%`];

            const [rows] = await this.pool.query(query, values);
            if(rows.length === 0) throw new Error('No users found')

            return rows.map(User.fromRow);
        } catch(error){
            throw new Error(error);
        }
    } 


    /**
     * Creates a new user in the database.
     * @async
     * @param {Object} userData - The data for the new user.
     * @param {string} userData.username - The username of the user.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The password of the user (will be hashed).
     * @param {string} [userData.profile_picture] - The profile picture URL of the user.
     * @param {string} [userData.bio] - The bio of the user.
     * @returns {Object} The created user object.
     * @throws {Error} If the email or username already exists or there is an error inserting the user.
     */
    async createUser(userData){
        try{
            const {username, email, password, profile_picture, bio} = userData;
            const hashedPassword = await bcrypt.hash(password, 12); // hash the password

            // check if the provided username or email already exist in the database
            const [checkIfExists] = await this.pool.query
                (`SELECT * FROM users WHERE email = ? OR username = ?`,[email, username]);
            if(checkIfExists.length > 0){
                throw new Error(`Account with this email or username already exists`);
            }
            
            const [result] = await this.pool.query
            (`INSERT INTO users (username, email, password, profile_picture_url, bio, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,[username, email, hashedPassword, profile_picture, bio]);
            
            // query for the created user in order to return it with created and updated at
            const [createdUser] = await this.pool.query
            (`SELECT user_id AS id, username, email, password, profile_picture_url, bio, created_at, updated_at 
                FROM users WHERE user_id = ?`,
                [result.insertId]
                );
        
            return createdUser[0];
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Updates a user in the database.
     * @async
     * @param {number} id - The ID of the user to update.
     * @param {Object} userData - The updated user data.
     * @param {string} [userData.username] - The new username.
     * @param {string} [userData.email] - The new email.
     * @param {string} [userData.password] - The new password (will be hashed).
     * @param {string} [userData.profile_picture] - The new profile picture URL.
     * @param {string} [userData.bio] - The new bio.
     * @returns {boolean} True if the user was updated, false otherwise.
     * @throws {Error} If the email or username already exists or there is an error updating the user.
     */
    async updateUser(id, userData) {
        try {
            // Initialize an array to hold the fields to update and a corresponding values array
            const fields = [];
            const values = [];
    
            // Only include fields that are provided
            if (userData.username) {

                const [checkIfExists] = await this.pool.query
                    (`SELECT * FROM users WHERE username = ?`,[userData.username]);
                if(checkIfExists.length > 0){
                    throw new Error(`Username already exists`);
                }
                fields.push('username = ?');
                values.push(userData.username);
            }
            if (userData.email) {

                const [checkIfExists] = await this.pool.query
                    (`SELECT * FROM users WHERE email = ?`,[email]);
                if(checkIfExists.length > 0){
                    throw new Error(`Email already exists`);
                }

                fields.push('email = ?');
                values.push(userData.email);
            }
            if (userData.password) {
                fields.push('password = ?');

                const hashedPassword = await bcrypt.hash(userData.password, 12);
                values.push(hashedPassword);
            }
            if (userData.profile_picture) {
                fields.push('profile_picture_url = ?');
                values.push(userData.profile_picture);
            }
            if (userData.bio) {
                fields.push('bio = ?');
                values.push(userData.bio);
            }
    
            // Always update the 'updated_at' field when updating the user
            fields.push('updated_at = NOW()');
             
            // Add the user ID to the values array at the end
            values.push(id);
    
            // Execute the query
            const [result] = await this.pool.query
            (`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values);
    
            // Check if any rows were updated
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Deletes a user from the database.
     * @async
     * @param {number} id - The ID of the user to delete.
     * @returns {boolean} True if the user was deleted, false otherwise.
     * @throws {Error} If there is an error deleting the user.
     */
    async deleteUser(id){
        try{
            const[result] = await this.pool.query(`DELETE FROM users WHERE user_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new UserService();