const { pool } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  static get tableName() {
    return this.name
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .substring(1);
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error in findById for ${this.tableName}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        `UPDATE ${this.tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in delete for ${this.tableName}:`, error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`
      );
      return rows;
    } catch (error) {
      console.error(`Error in getAll for ${this.tableName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseModel; 