// services/recordcategoryService.js
const { initDB } = require(`../config/database`);
const RecordCategory = require(`../models/recordcategoryModel`);

class RecordCategoryService{
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
     * Retrieve all record categories
     * @async
     * @returns {Array} List of all record categories
     * @throws {Error} Throws error if database query fails
     */
    async getAllRecordCategories(){
        try{
            const [rows] = await this.pool.query
            (`SELECT record_id, rc.category_id, category_name
            FROM record_categories rc
            JOIN categories c ON rc.category_id = c.category_id`);
            return rows.map(RecordCategory.fromRow);
        } catch(error) {
            throw new Error();
        }
    }

    /**
     * Retrieve a record category by ID
     * @async
     * @param {number} id - Record category ID
     * @returns {Object} The record category details
     * @throws {Error} Throws error if record category not found or database query fails
     */
    async getRecordCategoryById(id){
        try{
            const [rows] = await this.pool.query
            (`SELECT record_id, rc.category_id, category_name
            FROM record_categories rc
            JOIN categories c ON rc.category_id = c.category_id
            WHERE record_category_id = ?`,[id]);

            if (rows.length === 0) throw new Error(`Record category not found`);
            return RecordCategory.fromRow(rows[0]);
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Create a new record category
     * @async
     * @param {Object} recordCategoryData - The record category data
     * @param {number} recordCategoryData.recordId - The record ID
     * @param {number} recordCategoryData.categoryId - The category ID
     * @returns {Object} The created record category with its ID
     * @throws {Error} Throws error if validation fails or database query fails
     */
    async createRecordCategory(recordCategoryData){
        try{
            const {recordId, categoryId} = recordCategoryData;

            const [checkRecord] = await this.pool.query
                (`SELECT game_id FROM records WHERE record_id = ?`,[recordId]);
            if(checkRecord.length === 0) throw new Error('Record id is invalid');

            // get the records game_id
            const recordGameId = checkRecord[0].game_id;

            const [checkCategory] = await this.pool.query
                (`SELECT game_id FROM categories WHERE category_id = ?`,[categoryId]);
            if(checkCategory.length === 0) throw new Error('Category id is invalid');

            // get the categories game_id
            const categoryGameId = checkCategory[0].game_id;

            // compare if the category's game_id matches the record's game_id
            // if yes we throw an error
            if(recordGameId !== categoryGameId){
                throw new Error('Record and Category belong to different games');
            }

            const [result] = await this.pool.query
            (`INSERT INTO record_categories (record_id ,category_id)
                 VALUES (?, ?)`,[recordId, categoryId]);
        
            return {id: result.insertId, recordId, categoryId};
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Update a record category by ID
     * @async
     * @param {number} id - The record category ID
     * @param {Object} recordCategoryData - The updated record category data
     * @param {number} recordCategoryData.categoryId - The new category ID
     * @returns {boolean} True if update was successful, otherwise false
     * @throws {Error} Throws error if validation fails or database query fails
     */
    async updateRecordCategory(id, recordCategoryData) {
        try {
            const { categoryId } = recordCategoryData;
    
            // Check if the category ID is valid and get its associated game_id
            const [checkCategory] = await this.pool.query(
                `SELECT game_id FROM categories WHERE category_id = ?`,
                [categoryId]
            );
            if (checkCategory.length === 0) throw new Error('Category ID is invalid');

            // get the category's game id
            const categoryGameId = checkCategory[0].game_id;
    
            // Retrieve the record_id associated with the given record_category_id
            const [recordCategory] = await this.pool.query(
                `SELECT record_id FROM record_categories WHERE record_category_id = ?`,
                [id]
            );
            if (recordCategory.length === 0) throw new Error('Record category ID is invalid');
            const recordId = recordCategory[0].record_id;
    
            // Retrieve the game_id associated with the record_id
            const [recordGame] = await this.pool.query(
                `SELECT game_id FROM records WHERE record_id = ?`,
                [recordId]
            );
            if (recordGame.length === 0) throw new Error('Record ID is invalid');
            const recordGameId = recordGame[0].game_id;
    
            // compare if the category's game_id matches the record's game_id
            // if yes we throw an error
            if (recordGameId !== categoryGameId) {
                throw new Error('Record and Category belong to different games');
            }
    
            // Update the record_category with the new category_id
            const [result] = await this.pool.query(
                'UPDATE record_categories SET category_id = ? WHERE record_category_id = ?',
                [categoryId, id]);
    
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a record category by ID
     * @async
     * @param {number} id - The record category ID
     * @returns {boolean} True if deletion was successful, otherwise false
     * @throws {Error} Throws error if database query fails
     */
    async deleteRecordCategory(id){
        try{
            const[result] = await this.pool.query
                (`DELETE FROM record_categories WHERE record_category_id = ?`,[id]);
            return result.affectedRows > 0;
        } catch(error) {
            throw new Error(error);
        }
    }
}

module.exports = new RecordCategoryService();