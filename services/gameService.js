// services/gameService.js
const Game = require(`../models/gameModel`);
const {initDB} = require(`../config/database`);

class GameService{
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
     * Retrieve all games
     * @async
     * @returns {Array} List of all games
     * @throws {Error} Throws error if database query fails
     */
    async getAllGames(){
        try{
            const [rows] = await this.pool.query
                (`SELECT * FROM games`);
            return rows.map(Game.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieve a game by ID
     * @async
     * @param {number} id - The game ID
     * @returns {Object} The game details
     * @throws {Error} Throws error if game not found or database query fails
     */
    async getGameById(id){
        try{
            const [rows] = await this.pool.query
                (`SELECT * FROM games WHERE game_id = ?`,[id]);

            if(rows.length === 0) throw new Error('Game not found');
            return Game.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Search for games by name
     * @async
     * @param {Object} searchData - Search data
     * @param {string} searchData.searchTerm - The search term to filter game names
     * @returns {Array} List of games that match the search term
     * @throws {Error} Throws error if database query fails
     */
    async searchGame({searchTerm}){
        try{
            const query = 'SELECT * FROM games WHERE game_name LIKE ?';
            const values = [`%${searchTerm}%`];

            const [rows] = await this.pool.query(query, values);
            return rows.map(Game.fromRow);

        } catch(error){
            throw new Error(error);
        }
    } 

    /**
     * Create a new game
     * @async
     * @param {Object} gameData - The game data
     * @param {string} gameData.name - The name of the game
     * @param {string} gameData.icon - The URL for the game's icon
     * @param {string} gameData.date - The release date of the game
     * @param {string} gameData.rules - The rules of the game
     * @param {string} gameData.dev - The developer of the game
     * @returns {Object} The created game with its ID and data
     * @throws {Error} Throws error if database query fails
     */
    async createGame(gameData){
        try{
            const {name, icon, date, rules, dev} = gameData;
            const [result] = await this.pool.query
                (`INSERT INTO games (game_name, icon_url, release_date, rules, developer)
                    VALUES(?,?,?,?,?)`,[name, icon, date, rules, dev]);
            
            return {id: result.insertId, name, icon, date, rules, dev};
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Update a game by ID
     * @async
     * @param {number} id - The game ID
     * @param {Object} gameData - The updated game data
     * @param {string} [gameData.name] - The new game name
     * @param {string} [gameData.icon] - The new game icon URL
     * @param {string} [gameData.date] - The new release date of the game
     * @param {string} [gameData.rules] - The updated rules of the game
     * @param {string} [gameData.dev] - The updated developer of the game
     * @returns {boolean} True if update was successful, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async updateGame(id, gameData){
        try{
            // Initialize an array to hold the fields to update and a values array
            const fields = [];
            const values = [];

            if(gameData.name){
                fields.push("game_name = ?");
                values.push(gameData.name);
            }

            if(gameData.icon){
                fields.push("icon = ?");
                values.push(gameData.icon);
            }

            if(gameData.date){
                fields.push(`release_date = ?`);
                values.push(gameData.date);
            }

            if(gameData.rules){
                fields.push("rules = ?");
                values.push(gameData.rules);
            }

            if(gameData.dev){
                fields.push("developer = ?");
                values.push(gameData.dev);
            }

            values.push(id);

            const[result] = await this.pool.query
                (`UPDATE games SET ${fields.join(', ')} WHERE game_id = ?`, values);
            
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a game by ID
     * @async
     * @param {number} id - The game ID
     * @returns {boolean} True if deletion was successful, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async deleteGame(id){
        try{
            const [result] = await this.pool.query
                (`DELETE FROM games WHERE game_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new GameService();