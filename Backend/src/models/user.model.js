const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
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

  static async update(id, { nombre, email, rol }) {
    try {
      const [result] = await pool.execute(
        'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ? AND deleted_at IS NULL',
        [nombre, email, rol, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
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

module.exports = User; 