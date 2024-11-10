// models/categoryModel.js

/**
 * Represents a Category associated with a game.
 * @class
 */
class Category{
    /**
     * Creates an instance of Category.
     * @param {number} id - The unique identifier for the Category.
     * @param {number} gameId - The unique identifier for the associated game.
     * @param {string} name - The name of the category.
     * @param {string} desc - A description of the category.
     */
    constructor(id, gameId, name, desc){
        this.id = id;
        this.gameId = gameId;
        this.name = name;
        this.desc = desc;
    }

    /**
     * Creates a new Category instance from a database row.
     * This method maps the database row to a Category object.
     * 
     * @param {Object} row - The database row representing the Category.
     * @param {number} row.category_id - The unique ID for the Category.
     * @param {number} row.game_id - The ID of the associated game.
     * @param {string} row.category_name - The name of the category.
     * @param {string} row.description - The description of the category.
     * @returns {Category} - A new instance of Category.
     */
    static fromRow(row){
        return new Category(
            row.category_id,
            row.game_id,
            row.category_name,
            row.description
        )
    }
}

module.exports = Category;