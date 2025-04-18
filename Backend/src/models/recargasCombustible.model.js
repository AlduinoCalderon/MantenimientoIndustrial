const BaseModel = require('./base.model');
const { pool } = require('../config/database');

class RecargasCombustible extends BaseModel {
  static get tableName() {
    return 'recargas_combustible';
  }

  static async create({ vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id }) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO recargas_combustible (vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in create fuel recharge:', error);
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const validFields = ['vehiculo_id', 'kilometraje', 'cantidad', 'gasolinera', 'foto_ticket', 'usuario_id'];
      const fieldsToUpdate = {};
      const values = [];
      
      // Filtrar solo los campos válidos que no son undefined
      for (const field of validFields) {
        if (updates[field] !== undefined) {
          fieldsToUpdate[field] = updates[field];
          values.push(updates[field]);
        }
      }
      
      if (Object.keys(fieldsToUpdate).length === 0) {
        return false;
      }
      
      // Construir la consulta SQL dinámicamente
      const setClause = Object.keys(fieldsToUpdate)
        .map(field => `${field} = ?`)
        .join(', ');
      
      values.push(id);
      
      const query = `UPDATE recargas_combustible SET ${setClause} WHERE id = ? AND deleted_at IS NULL`;
      
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update fuel recharge:', error);
      throw error;
    }
  }

  static async findByVehiculoId(vehiculoId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM recargas_combustible WHERE vehiculo_id = ? AND deleted_at IS NULL',
        [vehiculoId]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByVehiculoId:', error);
      throw error;
    }
  }
}

module.exports = RecargasCombustible; 