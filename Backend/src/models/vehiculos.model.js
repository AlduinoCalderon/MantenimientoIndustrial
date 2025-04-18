const BaseModel = require('./base.model');
const { pool } = require('../config/database');

class Vehiculos extends BaseModel {
  constructor() {
    super('vehiculos');
  }

  static async create({ modelo, placas }) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO vehiculos (modelo, placas) VALUES (?, ?)',
        [modelo, placas]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { modelo, placas }) {
    try {
      const [result] = await pool.execute(
        'UPDATE vehiculos SET modelo = ?, placas = ? WHERE id = ? AND deleted_at IS NULL',
        [modelo, placas, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vehiculos; 