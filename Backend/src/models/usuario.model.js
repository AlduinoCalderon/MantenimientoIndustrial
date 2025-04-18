const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const BaseModel = require('./base.model');

class Usuario extends BaseModel {
  static get tableName() {
    return 'usuarios';
  }

  static async create({ nombre, email, contraseña, rol }) {
    try {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      const [result] = await pool.execute(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hashedPassword, rol]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM usuarios WHERE email = ? AND deleted_at IS NULL',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const validFields = ['nombre', 'email', 'contraseña', 'rol'];
      const fieldsToUpdate = {};
      const values = [];
      let passwordIndex = -1;
      
      // Filtrar solo los campos válidos que no son undefined
      for (const field of validFields) {
        if (updates[field] !== undefined) {
          fieldsToUpdate[field] = updates[field];
          if (field === 'contraseña') {
            passwordIndex = values.length;
          }
          values.push(updates[field]);
        }
      }
      
      if (Object.keys(fieldsToUpdate).length === 0) {
        return false;
      }
      
      // Si hay una contraseña, hashearla
      if (passwordIndex !== -1 && values[passwordIndex]) {
        values[passwordIndex] = await bcrypt.hash(values[passwordIndex], 10);
      }
      
      // Construir la consulta SQL dinámicamente
      const setClause = Object.keys(fieldsToUpdate)
        .map(field => `${field} = ?`)
        .join(', ');
      
      values.push(id);
      
      const query = `UPDATE usuarios SET ${setClause} WHERE id = ? AND deleted_at IS NULL`;
      
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update user:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE usuarios SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nombre, email, rol FROM usuarios WHERE deleted_at IS NULL'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario; 