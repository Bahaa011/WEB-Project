// controllers/recordController.js
const gameService = require('../services/gameService');
const recordService = require('../services/recordService');

/**
 * Controller class for handling record-related requests.
 * Provides methods for retrieving, creating, updating, approving, rejecting, and deleting records.
 * @class
 */
class RecordController {
    /**
     * Handles the request for getting all records.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object containing the list of all records.
     * @returns {Object} JSON response containing the list of all records.
     */
    async getAllRecords(req, res) {
        try {
            const records = await recordService.getAllRecords();
            res.json(records);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting a record by its ID.
     * @async
     * @param {Object} req - The request object containing the record ID.
     * @param {Object} res - The response object containing the record details.
     * @returns {Object} JSON response containing the requested record.
     */
    async getRecordById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const record = await recordService.getRecordById(id);

            res.json(record);
        } catch (error) {
            if(error.message.includes(`Record not found`)){
                return res.status(404).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for getting the leaderboard by filters (category and version).
     * @async
     * @param {Object} req - The request object containing the filter criteria (categoryId, versionId).
     * @param {Object} res - The response object containing the filtered leaderboard records.
     * @returns {Object} JSON response containing the filtered leaderboard records.
     */
    async getLeaderboardByFilters(req, res){
        try{
            const id = parseInt(req.params.id, 10);
            const {categoryId, versionId} = req.body;

            const records = await recordService.getLeaderboardByFilters
                (id,{categoryId, versionId});
            
            res.json(records);
        } catch(error) {
            if(error.message.includes(`No records found`)){
                return res.status(404).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for creating a new record.
     * @async
     * @param {Object} req - The request object containing the record data (userId, gameId, versionId, time, url, notes).
     * @param {Object} res - The response object containing the newly created record.
     * @returns {Object} JSON response containing the created record's details.
     */
    async createRecord(req, res) {
        try {
            const {userId, gameId ,versionId, time, notes} = req.body;
            let url = req.file ? `/uploads/${req.file.filename}` : null;

            const newRecord = await recordService.createRecord
                ({ userId, gameId, versionId, time, url, notes });
            res.redirect('/games')
        } catch (error) {
            res.render('game', {error: error.message});
        }
    }

    /**
     * Handles the request for updating an existing record.
     * @async
     * @param {Object} req - The request object containing record ID and update data.
     * @param {Object} res - The response object indicating the success or failure of the update operation.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateRecord(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { userId, gameId, versionId, time, url, status, notes } = req.body;
            if (!userId && !gameId && !versionId && !time && !url && !status && !notes) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            const success = await recordService.updateRecord
                (id, { userId, gameId, versionId, time, url, status, notes });
            if (!success) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.json({ message: 'Record updated successfully' });
        } catch (error) {
            if(error.message.includes('Version id is invalid')){
                return res.status(400).json({message: error.message});
            } else if(error.message.includes('Game ID and version ID are not compatible')){
                return res.status(400).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for approving a record.
     * @async
     * @param {Object} req - The request object containing the record ID.
     * @param {Object} res - The response object indicating the success or failure of the approval.
     * @returns {Object} JSON response indicating the approval result.
     */
    async approveRecord(req, res) {
        try {
            const { id } = req.params;
            const result = await recordService.approveRecord(id);

            return res.redirect('/games');
        } catch (error) {
            return res.redirect('/games', {error: error.message});
        }
    }

    /**
     * Handles the request for rejecting a record.
     * @async
     * @param {Object} req - The request object containing the record ID.
     * @param {Object} res - The response object indicating the success or failure of the rejection.
     * @returns {Object} JSON response indicating the rejection result.
     */

    async rejectRecord(req, res) {
        try {
            const { id } = req.params;
            const result = await recordService.rejectRecord(id);

            return res.redirect('/games');
        } catch (error) {
            return res.redirect('/games', {error: error.message});
        }
    }

    /**
     * Handles the request for deleting a record.
     * @async
     * @param {Object} req - The request object containing the record ID to be deleted.
     * @param {Object} res - The response object indicating the success or failure of the deletion.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteRecord(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await recordService.deleteRecord(id);
            if (!success) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.json({ message: 'Record deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new RecordController();
