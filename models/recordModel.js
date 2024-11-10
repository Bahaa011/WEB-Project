// models/recordModel.js

/**
 * Represents a record in the system.
 * @class
 */
class Record {
    /**
     * Creates an instance of a Record.
     * 
     * @constructor
     * @param {number} id - The unique identifier for the record.
     * @param {number} userId - The ID of the user who submitted the record.
     * @param {string} username - The username of the user who submitted the record.
     * @param {number} gameId - The ID of the game related to the record.
     * @param {string} gameName - The name of the game related to the record.
     * @param {number} versionId - The ID of the game version related to the record.
     * @param {string} versionName - The name of the game version related to the record.
     * @param {string} time - The time it took to complete the record (in time format).
     * @param {string} date - The date when the record was submitted.
     * @param {string} url - The URL of the video proof of the record.
     * @param {string} status - The status of the record (e.g., pending, approved).
     * @param {string} notes - Additional notes related to the record.
     * @param {Array<string>} categories - List of categories associated with the record.
     */
    constructor(id, userId, username, gameId, gameName, versionId, versionName, time, date, url, status, notes, categories) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.gameId = gameId;
        this.gameName = gameName;
        this.versionId = versionId;
        this.versionName = versionName;
        this.time = time;
        this.date = date;
        this.url = url;
        this.status = status;
        this.notes = notes;
        this.categories = categories;
    }

    /**
     * Creates a new Record instance from a database row.
     * This method maps the database row to a Record object.
     * 
     * @static
     * @param {Object} row - The database row object.
     * @param {number} row.record_id - The unique identifier for the record.
     * @param {number} row.user_id - The ID of the user who submitted the record.
     * @param {string} row.username - The username of the user who submitted the record.
     * @param {number} row.game_id - The ID of the game related to the record.
     * @param {string} row.game_name - The name of the game related to the record.
     * @param {number} row.version_id - The ID of the game version related to the record.
     * @param {string} row.version_name - The name of the game version related to the record.
     * @param {string} row.record_time - The time it took to complete the record.
     * @param {string} row.date_submitted - The date when the record was submitted.
     * @param {string} row.video_url - The URL of the video proof of the record.
     * @param {string} row.status - The status of the record (e.g., pending, approved).
     * @param {string} row.notes - Additional notes related to the record.
     * @param {string} row.categories - A comma-separated list of categories associated with the record.
     * @returns {Record} A new instance of the Record class.
     */
    static fromRow(row) {
        return new Record(
            row.record_id,
            row.user_id,
            row.username,
            row.game_id,
            row.game_name,
            row.version_id,
            row.version_name,
            row.record_time,
            row.date_submitted,
            row.video_url,
            row.status,
            row.notes,
            row.categories ? row.categories.split(', ').map(category => category.trim()) : [] // Split categories into an array
        );
    }
}

module.exports = Record;
