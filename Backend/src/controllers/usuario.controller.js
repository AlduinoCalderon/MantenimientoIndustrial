const Usuario = require('../models/usuario.model');

const usuarioController = {
  async crearUsuario(req, res) {
    try {
      const { nombre, email, contraseña, rol } = req.body;
      const userId = await Usuario.create({ nombre, email, contraseña, rol });
      res.status(201).json({
        status: 'success',
        data: { id: userId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async obtenerUsuarioPorId(req, res) {
    try {
      const user = await Usuario.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async actualizarUsuario(req, res) {
    try {
      const updated = await Usuario.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found or no changes made'
        });
      }
      res.json({
        status: 'success',
        message: 'User updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async eliminarUsuario(req, res) {
    try {
      const deleted = await Usuario.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async obtenerTodosLosUsuarios(req, res) {
    try {
      const users = await Usuario.getAll();
      res.json({
        status: 'success',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching users',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = usuarioController; 