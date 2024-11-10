// controllers/gameversionController.js
const gameversionService = require('../services/gameversionService');

/**
 * Controller class for handling game version-related requests.
 * Provides methods for retrieving, creating, updating, and deleting game versions.
 * @class
 */
class GameVersionController {
    /**
     * Handles the request for getting all game versions.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all game versions.
     * @returns {Object} JSON response containing the list of all game versions.
     */
    async getAllGameVersions(req, res) {
        try {
            const versions = await gameversionService.getAllGameVersions();
            res.json(versions);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a game version by its ID.
     * @async
     * @param {Object} req - The request object containing the game version ID.
     * @param {Object} res - The response object containing the game version details.
     * @returns {Object} JSON response containing the requested game version.
     */
    async getGameVersionById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const version = await gameversionService.getGameVersionById(id);

            res.json(version);
        } catch (error) {
            if(error.message.includes('Game version not found')){
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a game version by its associated game ID.
     * @async
     * @param {Object} req - The request object containing the game ID.
     * @param {Object} res - The response object containing the game version details.
     * @returns {Object} JSON response containing the requested game version.
     */
    async getGameVersionByGameId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const version = await gameversionService.getGameVersionByGameId(id);

            res.json(version);
        } catch (error) {
            if(error.message.includes('Game version not found')){
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for creating a new game version.
     * @async
     * @param {Object} req - The request object containing the game ID and version name.
     * @param {Object} res - The response object containing the newly created game version.
     * @returns {Object} JSON response containing the created game version's details.
     */
    async createGameVersion(req, res) {
        try {
            const {gameId, name} = req.body;
            
            const newVersion = await gameversionService.createGameVersion({ gameId, name });
            res.status(201).json(newVersion);
        } catch (error) {
            if(error.message.includes('Game id is invalid')){
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for updating an existing game version.
     * @async
     * @param {Object} req - The request object containing the game version ID and the new version name.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateGameVersion(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'No category name to update' });
            }
            const success = await gameversionService.updateGameVersion(id, { name });
            if (!success) {
                return res.status(404).json({ message: 'Version not found' });
            }
            res.json({ message: 'Version updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a game version.
     * @async
     * @param {Object} req - The request object containing the game version ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the deletion.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteGameVersion(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await gameversionService.deleteGameVersion(id);
            if (!success) {
                return res.status(404).json({ message: 'Version not found' });
            }
            res.json({ message: 'Version deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new GameVersionController();
