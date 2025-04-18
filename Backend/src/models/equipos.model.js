const BaseModel = require('./base.model');
const { pool } = require('../config/database');

class Equipos extends BaseModel {
  constructor() {
    super('equipos');
  }

  static async create({ nombre, descripcion, cliente_id }) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO equipos (nombre, descripcion, cliente_id) VALUES (?, ?, ?)',
        [nombre, descripcion, cliente_id]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { nombre, descripcion, cliente_id }) {
    try {
      const [result] = await pool.execute(
        'UPDATE equipos SET nombre = ?, descripcion = ?, cliente_id = ? WHERE id = ? AND deleted_at IS NULL',
        [nombre, descripcion, cliente_id, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Equipos; 