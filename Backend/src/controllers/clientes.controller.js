const Clientes = require('../models/clientes.model');

const clientesController = {
  async createCliente(req, res) {
    try {
      const { nombre, email, contraseña, contacto, empresa } = req.body;
      const clienteId = await Clientes.create({ nombre, email, contraseña, contacto, empresa });
      res.status(201).json({
        status: 'success',
        data: { id: clienteId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating cliente',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getClienteById(req, res) {
    try {
      const cliente = await Clientes.findById(req.params.id);
      if (!cliente) {
        return res.status(404).json({
          status: 'error',
          message: 'Cliente not found'
        });
      }
      res.json({
        status: 'success',
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching cliente',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateCliente(req, res) {
    try {
      const updated = await Clientes.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Cliente not found or no changes made'
        });
      }
      res.json({
        status: 'success',
        message: 'Cliente updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating cliente',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async deleteCliente(req, res) {
    try {
      const deleted = await Clientes.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Cliente not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Cliente deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting cliente',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getAllClientes(req, res) {
    try {
      const clientes = await Clientes.getAll();
      res.json({
        status: 'success',
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching clientes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = clientesController; 