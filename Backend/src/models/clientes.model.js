const BaseModel = require('./base.model');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Clientes extends BaseModel {
  constructor() {
    super('clientes');
  }

  static async create({ nombre, email, contraseña, contacto, empresa }) {
    try {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      const [result] = await pool.execute(
        'INSERT INTO clientes (nombre, email, contraseña, contacto, empresa) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, hashedPassword, contacto, empresa]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, { nombre, email, contacto, empresa }) {
    try {
      const [result] = await pool.execute(
        'UPDATE clientes SET nombre = ?, email = ?, contacto = ?, empresa = ? WHERE id = ? AND deleted_at IS NULL',
        [nombre, email, contacto, empresa, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Clientes; 