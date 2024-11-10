// services/categoryService.js
const { initDB } = require(`../config/database`);
const Category = require(`../models/categoryModel`);

class CategoryService{
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
     * Retrieve all categories
     * @async
     * @returns {Array} List of all categories
     * @throws {Error} Throws error if database query fails
     */
    async getAllCategories(){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM categories;`);
            return rows.map(Category.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieve a category by its ID
     * @async
     * @param {number} id - The category ID
     * @returns {Object} The category details
     * @throws {Error} Throws error if category not found or database query fails
     */
    async getCategoryById(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT * FROM categories WHERE category_id = ?`,[id]);

            if (rows.length === 0) throw new Error('Category not found');
            return Category.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Retrieve a category by game ID
     * @async
     * @param {number} id - The game ID
     * @returns {Object} The category details associated with the game ID
     * @throws {Error} Throws error if category not found or database query fails
     */
    async getCategoryByGameId(id){
        try{    
            const [rows] = await this.pool.query
            (`SELECT * FROM categories where game_id = ?`,[id]);
            if (rows.length === 0) throw new Error('Category not found');
            return rows.map(Category.fromRow);
        } catch(error){
            throw new Error(error);
        }
    }

    /**
     * Create a new category
     * @async
     * @param {Object} categoryData - The category data
     * @param {number} categoryData.gameId - The game ID to associate the category with
     * @param {string} categoryData.name - The name of the category
     * @param {string} categoryData.desc - The description of the category
     * @returns {Object} The created category with its details
     * @throws {Error} Throws error if game ID is invalid or database query fails
     */
    async createCategory(categoryData){
        try{
            const {gameId, name, desc} = categoryData;

            const [check] = await this.pool.query(`SELECT * FROM games WHERE game_id = ?`,[gameId]);
            if(check.length === 0) throw new Error('Game id is invalid');
            
            const [result] = await this.pool.query
            (`INSERT INTO categories (game_id ,category_name, description)
                 VALUES (?, ?, ?)`,[gameId, name, desc]);
        
            return {id: result.insertId, gameId, name, desc};
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Update an existing category by ID
     * @async
     * @param {number} id - The category ID
     * @param {Object} categoryData - The updated category data
     * @param {string} categoryData.name - The new name of the category
     * @param {string} categoryData.desc - The new description of the category
     * @returns {boolean} True if the category was updated successfully, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async updateCategory(id, categoryData) {
        try{
            const fields = [];
            const values = [];

            if(categoryData.name){
                fields.push("category_name = ?");
                values.push(categoryData.name);
            }

            if(categoryData.desc){
                fields.push("description = ?");
                values.push(categoryData.desc);
            }

            values.push(id);

            const[result] = await this.pool.query
                (`UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`, values);
            
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a category by ID
     * @async
     * @param {number} id - The category ID
     * @returns {boolean} True if the category was deleted successfully, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async deleteCategory(id){
        try{
            const[result] = await this.pool.query(`DELETE FROM categories WHERE category_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new CategoryService();