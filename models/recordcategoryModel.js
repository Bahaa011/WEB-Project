// models/recordcategoryModel.js

/**
 * Represents a RecordCategory which links a record to a category.
 * @class
 */

class RecordCategory{
    /**
     * Creates an instance of RecordCategory.
     * @param {number} id - The unique identifier for the RecordCategory.
     * @param {number} recordId - The unique identifier for the associated record.
     * @param {number} categoryId - The unique identifier for the associated category.
     */
    constructor(id, recordId, categoryId){
        this.id = id;
        this.recordId = recordId;
        this.categoryId = categoryId;
    }

    /**
     * Creates a new RecordCategory instance from a database row.
     * This method maps the database row to a Recordcategory object.
     * 
     * @param {Object} row - The database row representing the RecordCategory.
     * @param {number} row.record_category_id - The unique ID for the RecordCategory.
     * @param {number} row.record_id - The ID of the associated record.
     * @param {number} row.category_id - The ID of the associated category.
     * @returns {RecordCategory} - A new instance of RecordCategory.
     */
    static fromRow(row){
        return new RecordCategory(
            row.record_category_id,
            row.record_id,
            row.category_id
        )
    }
}

module.exports = RecordCategory;