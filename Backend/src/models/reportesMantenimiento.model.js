const BaseModel = require('./base.model');
const { pool } = require('../config/database');

class ReportesMantenimiento extends BaseModel {
  static get tableName() {
    return 'reportes_mantenimiento';
  }

  static async create({ equipo_id, descripcion, tipo, evidencias, usuario_id }) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO reportes_mantenimiento (equipo_id, descripcion, tipo, evidencias, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [equipo_id, descripcion, tipo, evidencias, usuario_id]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in create reporte:', error);
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const validFields = ['equipo_id', 'descripcion', 'tipo', 'evidencias', 'usuario_id'];
      const fieldsToUpdate = {};
      const values = [];
      
      // Filtrar solo los campos válidos que no son undefined
      for (const field of validFields) {
        if (updates[field] !== undefined && updates[field] !== null) {
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
      
      const query = `UPDATE reportes_mantenimiento SET ${setClause} WHERE id = ? AND deleted_at IS NULL`;
      
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update reporte:', error);
      throw error;
    }
  }

  static async findByClienteId(clienteId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reportes_mantenimiento WHERE cliente_id = ? AND deleted_at IS NULL',
        [clienteId]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByClienteId:', error);
      throw error;
    }
  }

  static async findByEquipoId(equipoId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reportes_mantenimiento WHERE equipo_id = ? AND deleted_at IS NULL',
        [equipoId]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByEquipoId:', error);
      throw error;
    }
  }

  static async findByTipo(tipo) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reportes_mantenimiento WHERE tipo = ? AND deleted_at IS NULL',
        [tipo]
      );
      return rows;
    } catch (error) {
      console.error('Error in findByTipo:', error);
      throw error;
    }
  }
}

module.exports = ReportesMantenimiento; 