// services/gameversionService.js
const { initDB } = require(`../config/database`);
const GameVersion = require(`../models/gameversionModel`);

class GameVersionService{
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
     * Retrieve all game versions
     * @async
     * @returns {Array} List of all game versions
     * @throws {Error} Throws error if database query fails
     */
    async getAllGameVersions(){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM game_versions;`);
            return rows.map(GameVersion.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieve a game version by ID
     * @async
     * @param {number} id - Game version ID
     * @returns {Object} The game version details
     * @throws {Error} Throws error if game version not found or database query fails
     */
    async getGameVersionById(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM game_versions WHERE version_id = ?`,[id]);
            if (rows.length === 0) throw new Error('Game version not found');
            return GameVersion.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Retrieve a game version by game ID
     * @async
     * @param {number} id - Game ID
     * @returns {Object} The game version details
     * @throws {Error} Throws error if game version not found or database query fails
     */
    async getGameVersionByGameId(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM game_versions WHERE game_id = ?`,[id]);
            if (rows.length === 0) throw new Error('Game version not found');
            return rows.map(GameVersion.fromRow);
        } catch(error) {
            //throw new Error(error);
        }
    }

    /**
     * Create a new game version
     * @async
     * @param {Object} gameVersionData - The game version data
     * @param {number} gameVersionData.gameId - The associated game ID
     * @param {string} gameVersionData.name - The version name
     * @returns {Object} The created game version with its ID
     * @throws {Error} Throws error if validation fails or database query fails
     */
    async createGameVersion(gameVersionData){
        try{
            const {gameId, name} = gameVersionData;

            const [check] = await this.pool.query(`SELECT * FROM games WHERE game_id = ?`,[gameId]);
            if(check.length === 0) throw new Error('Game id is invalid');

            const [result] = await this.pool.query
            (`INSERT INTO game_versions (game_id ,version_name)
                 VALUES (?, ?)`,[gameId, name]);
        
            return {id: result.insertId, gameId, name};
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Update a game version by ID
     * @async
     * @param {number} id - The game version ID
     * @param {Object} gameVersionData - The updated game version data
     * @param {string} gameVersionData.name - The new version name
     * @returns {boolean} True if update was successful, otherwise false
     * @throws {Error} Throws error if validation fails or database query fails
     */
    async updateGameVersion(id, gameVersionData) {
        try {
            const {name} = gameVersionData;
            const [result] = await this.pool.query(
                'UPDATE game_versions SET version_name = ? WHERE version_id = ?',
                [name, id]
              );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a game version by ID
     * @async
     * @param {number} id - The game version ID
     * @returns {boolean} True if deletion was successful, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async deleteGameVersion(id){
        try{
            const[result] = await this.pool.query(`DELETE FROM game_versions WHERE version_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new GameVersionService();