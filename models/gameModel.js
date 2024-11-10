// models/gameModel.js

/**
 * Represents a Game with its details such as name, release date, rules, and developer.
 * @class
 */
class Game{
    /**
     * Creates an instance of Game.
     * @param {number} id - The unique identifier for the Game.
     * @param {string} name - The name of the game.
     * @param {string} icon - The URL of the game's icon or resource.
     * @param {string} date - The release date of the game.
     * @param {string} rules - The rules or description for the game.
     * @param {string} dev - The developer of the game.
     */
    constructor(id, name, icon, date, rules, dev){
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.date = date;
        this.rules = rules;
        this.dev = dev;
    }

    /**
     * Creates a new Game instance from a database row.
     * This method maps the database row to a Game object.
     * 
     * @param {Object} row - The database row representing the Game.
     * @param {number} row.game_id - The unique ID for the Game.
     * @param {string} row.game_name - The name of the game.
     * @param {string} row.icon_url - The URL of the game's icon or resource.
     * @param {string} row.release_date - The release date of the game.
     * @param {string} row.rules - The rules or description for the game.
     * @param {string} row.developer - The developer of the game.
     * @returns {Game} - A new instance of Game.
     */
    static fromRow(row){
        return new Game(
            row.game_id,
            row.game_name,
            row.icon_url,
            row.release_date,
            row.rules,
            row.developer
        )
    }
}

module.exports = Game;