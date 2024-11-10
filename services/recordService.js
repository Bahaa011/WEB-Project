// services/recordService.js
const Record = require(`../models/recordModel`);
const {initDB} = require(`../config/database`);

/**
 * Service for managing speedrun records, including retrieving, creating, updating, and deleting records.
 * Also includes functionality for filtering records for leaderboard display.
 */
class RecordService{
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
     * Retrieves all records along with their associated categories, users, games, and versions.
     * 
     * @returns {Array} A list of records with their categories.
     * @throws {Error} Throws an error if the query fails.
     */
    async getAllRecords() {
        try {
            // SQL query to fetch records with their categories
            const query = `SELECT r.record_id, r.user_id, u.username, r.game_id, g.game_name,
            COALESCE(rc.categories, '') AS categories, r.version_id,
            gv.version_name, r.record_time, r.status,r.video_url, r.notes
            FROM records r
            JOIN users u ON r.user_id = u.user_id
            JOIN games g ON r.game_id = g.game_id
            JOIN game_versions gv ON r.version_id = gv.version_id
            LEFT JOIN (
                SELECT r2.record_id, 
                GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_name SEPARATOR ', ') AS categories
                FROM record_categories rc
                JOIN records r2 ON r2.record_id = rc.record_id
                LEFT JOIN categories c ON rc.category_id = c.category_id
                GROUP BY r2.record_id
            ) rc ON r.record_id = rc.record_id
             ORDER BY record_id ASC`;
            
            const [rows] = await this.pool.query(query);

            const records = rows.map(record => {
                
                const recordWithCategories = Record.fromRow(record);
                
                recordWithCategories.categories = record.categories.split(', ').map(category => category.trim());
                
                return recordWithCategories;
            });
            
            return records; // Return the records with their categories
        } catch (error) {
            throw new Error();
        }
    }

    /**
     * Retrieves a specific record by its ID along with its associated categories.
     * 
     * @param {number} id - The ID of the record.
     * @returns {Object} The record object with its categories.
     * @throws {Error} Throws an error if the record is not found or the query fails.
     */
    async getRecordById(id) {
        try {
            // SQL query to fetch a specific record by ID with its categories
            const query = `SELECT r.record_id, r.user_id, u.username, r.game_id, g.game_name,
            COALESCE(rc.categories, '') AS categories, r.version_id,
            gv.version_name, r.record_time, r.status,r.video_url, r.notes
            FROM records r
            JOIN users u ON r.user_id = u.user_id
            JOIN games g ON r.game_id = g.game_id
            JOIN game_versions gv ON r.version_id = gv.version_id
            LEFT JOIN (
                SELECT r2.record_id, 
                GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_name SEPARATOR ', ') AS categories
                FROM record_categories rc
                JOIN records r2 ON r2.record_id = rc.record_id
                LEFT JOIN categories c ON rc.category_id = c.category_id
                GROUP BY r2.record_id
            ) rc ON r.record_id = rc.record_id
             WHERE r.record_id = ?
             ORDER BY record_id ASC`;
            
            const [rows] = await this.pool.query(query, [id]);

            if (rows.length === 0) {
                throw new Error('Record not found');
            }

            const record = Record.fromRow(rows[0]);

            // Convert it into an array
            record.categories = rows[0].categories.split(', ').map(category => category.trim());
            
            return record;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Retrieves the leaderboard for a specific game, optionally filtered by category and version.
     * 
     * @param {number} gameId - The ID of the game.
     * @param {Object} filters - The filters to apply to the leaderboard.
     * @param {number} [filters.categoryId] - Optional category ID to filter by.
     * @param {number} [filters.versionId] - Optional version ID to filter by.
     * @returns {Array} A list of leaderboard entries.
     * @throws {Error} Throws an error if the query fails or no records are found.
     */
    async getLeaderboardByFilters(gameId, filters) {
        try {
            // Base query to fetch records along with categories
            let baseQuery = `
                SELECT r.record_id, r.user_id, u.username, r.game_id, g.game_name,
                    GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_name SEPARATOR ', ') AS categories,
                    r.version_id, gv.version_name, r.record_time, r.video_url, r.notes
                FROM records r
                JOIN users u ON r.user_id = u.user_id
                JOIN games g ON r.game_id = g.game_id
                JOIN game_versions gv ON r.version_id = gv.version_id
                LEFT JOIN record_categories rc ON r.record_id = rc.record_id
                LEFT JOIN categories c ON rc.category_id = c.category_id
                WHERE r.game_id = ?`;
    
            const queryParams = [gameId];
    
            // Add conditions based on the provided filters
            if (filters.categoryId) {
                baseQuery += ` AND c.category_id = ?`; // Filter by category_id
                queryParams.push(filters.categoryId);
            }
    
            if (filters.versionId) {
                baseQuery += ` AND r.version_id = ?`; // Filter by version_id
                queryParams.push(filters.versionId);
            }
    
            // Always order by record_time
            baseQuery += ` GROUP BY r.record_id
                            ORDER BY r.record_time ASC`;

            const [rows] = await this.pool.query(baseQuery, queryParams);

            if (rows.length === 0) {
                throw new Error(`No records found`);
            }
    
            return rows;
        } catch (error) {
            throw new Error(error);
        }
    }    
    /**
     * Creates a new record in the database.
     * 
     * @param {Object} recordData - The data for the new record.
     * @param {number} recordData.userId - The ID of the user submitting the record.
     * @param {number} recordData.gameId - The ID of the game for the record.
     * @param {number} recordData.versionId - The ID of the game version for the record.
     * @param {string} recordData.time - The time of the record.
     * @param {string} recordData.url - The video URL for the record.
     * @param {string} [recordData.notes] - Optional notes about the record.
     * @returns {Object} The created record.
     * @throws {Error} Throws an error if any validation or insertion fails.
     */
    async createRecord(recordData) {
        try {
            const { userId, gameId, versionId, time, url, notes } = recordData;
    
            // Check if the user ID is valid
            const [checkUserId] = await this.pool.query(
                `SELECT * FROM users WHERE user_id = ?`,
                [userId]
            );
            if (checkUserId.length === 0) throw new Error('User ID is invalid');
    
            // Check if the game ID is valid
            const [checkGameId] = await this.pool.query(
                `SELECT * FROM games WHERE game_id = ?`,
                [gameId]
            );
            if (checkGameId.length === 0) throw new Error('Game ID is invalid');
    
            // Check if the version ID is valid
            const [checkVersionId] = await this.pool.query(
                `SELECT * FROM game_versions WHERE version_id = ?`,
                [versionId]
            );
            if (checkVersionId.length === 0) throw new Error('Version ID is invalid');
    
            // Get the game_id associated with the version_id
            const [versionGameId] = await this.pool.query(
                `SELECT game_id FROM game_versions WHERE version_id = ?`,
                [versionId]
            );
    
            // Ensure the game_id from the game_versions table matches the one in the games table
            if (checkGameId[0].game_id !== versionGameId[0].game_id) {
                throw new Error('Game ID and version ID are not compatible');
            }
    
            // Insert the record into the records table
            const [result] = await this.pool.query(
                `INSERT INTO records
                    (user_id, game_id, version_id, record_time, video_url, status, notes, created_at)
                    VALUES(?, ?, ?, ?, ?, 'Pending', ?, NOW())`,
                [userId, gameId, versionId, time, url, notes]
            );
    
            // Retrieve the newly created record
            const [createdRecord] = await this.pool.query(
                `SELECT record_id AS id, user_id, game_id, version_id, record_time, video_url, status, notes, created_at
                FROM records WHERE record_id = ?`,
                [result.insertId]
            );
    
            return createdRecord[0];
        } catch (error) {
            throw new Error(error.message || error);
        }
    }

    /**
     * Updates an existing record in the database.
     * 
     * @param {number} id - The ID of the record to update.
     * @param {Object} recordData - The data to update the record with.
     * @returns {boolean} True if the record was updated, false otherwise.
     * @throws {Error} Throws an error if the update fails.
     */
    async updateRecord(id, recordData){
        try{
            // Initialize an array to hold the fields to update and a values array
            const fields = [];
            const values = [];

            if(recordData.versionId){
                const [checkVersionId] = await this.pool.query
                (`SELECT * FROM game_versions WHERE version_id = ?`,[recordData.versionId]);
                if(checkVersionId.length === 0) throw new Error('Version id is invalid');

                // Get the game_id associated with the version_id
                const [versionGameId] = await this.pool.query(
                    `SELECT game_id FROM game_versions WHERE version_id = ?`,
                    [recordData.versionId]);
                // Get the game_id associated with the record_id
                const [recordGameId] = await this.pool.query(
                    `SELECT game_id FROM records WHERE record_id = ?`,
                    [id]);
                
                // ensure they match
                if (recordGameId[0].game_id !== versionGameId[0].game_id) {
                    throw new Error('Game ID and version ID are not compatible');
                }

                fields.push(`version_id = ?`);
                values.push(recordData.versionId);
            }

            if(recordData.time){
                fields.push("record_time = ?");
                values.push(recordData.time);
            }

            if(recordData.url){
                fields.push("video_url = ?");
                values.push(recordData.url);
            }

            if(recordData.status){
                fields.push("status = ?");
                values.push(recordData.status);
            }

            if(recordData.notes){
                fields.push("notes = ?");
                values.push(recordData.notes);
            }

            values.push(id);

            const[result] = await this.pool.query
                (`UPDATE records SET ${fields.join(', ')} WHERE record_id = ?`, values);
            
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Approves a record and sets its status to 'Approved'.
     * 
     * @param {number} id - The ID of the record to approve.
     * @returns {boolean} True if the record was approved, false otherwise.
     * @throws {Error} Throws an error if the update fails.
     */
    async approveRecord(id) {
        try {
            const updated = await this.updateRecord(id, { status: 'Approved' });
    
            if (updated) {
                return { message: 'Record approved successfully' };
            } else {
                throw new Error('Record approval failed');
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Rejects a record and sets its status to 'Rejected'.
     * 
     * @param {number} id - The ID of the record to reject.
     * @returns {boolean} True if the record was rejected, false otherwise.
     * @throws {Error} Throws an error if the update fails.
     */
    async rejectRecord(id) {
        try {
            const updated = await this.updateRecord(id, { status: 'Rejected' });
    
            if (updated) {
                return { message: 'Record rejected successfully' };
            } else {
                throw new Error('Record rejection failed');
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Deletes a record by its ID.
     * 
     * @param {number} id - The ID of the record to delete.
     * @returns {boolean} True if the record was deleted, false otherwise.
     * @throws {Error} Throws an error if the deletion fails.
     */
    async deleteRecord(id){
        try{
            const [result] = await this.pool.query
                (`DELETE FROM records WHERE record_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new RecordService();