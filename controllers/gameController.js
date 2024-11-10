// controllers/gameController.js
const gameService = require('../services/gameService');

/**
 * Controller class for handling game-related requests.
 * Provides methods for retrieving, creating, updating, searching, and deleting games.
 * @class
 */

class GameController {
    /**
     * Handles the request for getting all games.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all games.
     * @returns {Object} JSON response containing the list of all games.
     */
    async getAllGames(req, res) {
        try {
            const games = await gameService.getAllGames();
            res.json(games);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a game by its ID.
     * @async
     * @param {Object} req - The request object containing the game ID.
     * @param {Object} res - The response object containing the game details.
     * @returns {Object} JSON response containing the requested game.
     */
    async getGamebyId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const game = await gameService.getGameById(id);

            res.json(game);
        } catch (error) {
            if(error.message.includes('Game not found')){
                return res.status(404).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for searching games based on a search term.
     * @async
     * @param {Object} req - The request object containing the search term.
     * @param {Object} res - The response object containing the search results.
     * @returns {Object} JSON response containing the search results or an error message.
     */
    async searchGame(req, res){
        try{
            const { q: searchTerm } = req.query;
            if (!searchTerm || searchTerm.trim() === '') {
                return res.status(400).json({ message: 'Search term is required' });
            }

            const games = await gameService.searchGame({ searchTerm });

            if (games.length === 0) {
                return res.status(404).json({ message: 'No games found' });
            }

            return res.status(200).json(games);
        } catch(error){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Handles the request for creating a new game.
     * @async
     * @param {Object} req - The request object containing the game details.
     * @param {Object} res - The response object containing the newly created game details.
     * @returns {Object} JSON response containing the created game details.
     */

    async createGame(req, res) {
        try {
            const { name, icon, date, rules, dev } = req.body;

            const newGame = await gameService.createGame({ name, icon, date, rules, dev });
            res.status(201).json(newGame);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for updating an existing game.
     * @async
     * @param {Object} req - The request object containing the game ID and the fields to update.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateGame(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name, icon, date, rules, dev } = req.body;
            if (!name && !icon && !date && !rules && !dev) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            const success = await gameService.updateGame(id, { name, icon, date, rules, dev });
            if (!success) {
                return res.status(404).json({ message: 'Game not found' });
            }
            res.json({ message: 'Game updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a game.
     * @async
     * @param {Object} req - The request object containing the game ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the deletion.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteGame(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await gameService.deleteGame(id);
            if (!success) {
                return res.status(404).json({ message: 'Game not found' });
            }
            res.json({ message: 'Game deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new GameController();
