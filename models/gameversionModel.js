// models/gameversionModel.js

/**
 * Represents a GameVersion which links a specific version of a game.
 * @class
 */
class GameVersion{
    /**
     * Creates an instance of GameVersion.
     * @param {number} id - The unique identifier for the GameVersion.
     * @param {number} gameId - The unique identifier for the associated game.
     * @param {string} name - The name of the game version.
     */
    constructor(id, gameId, name){
        this.id = id;
        this.gameId = gameId;
        this.name = name;
    }

    /**
     * Creates a new GameVersion instance from a database row.
     * This method maps the database row to a GameVersion object.
     * 
     * @param {Object} row - The database row representing the GameVersion.
     * @param {number} row.version_id - The unique ID for the GameVersion.
     * @param {number} row.game_id - The ID of the associated game.
     * @param {string} row.version_name - The name of the game version.
     * @returns {GameVersion} - A new instance of GameVersion.
     */
    static fromRow(row){
        return new GameVersion(
            row.version_id,
            row.game_id,
            row.version_name
        )
    }
}

module.exports = GameVersion;