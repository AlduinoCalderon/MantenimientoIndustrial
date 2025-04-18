const RecargasCombustible = require('../models/recargasCombustible.model');

const recargasCombustibleController = {
  async createRecarga(req, res) {
    try {
      const { vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id } = req.body;
      const recargaId = await RecargasCombustible.create({ vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id });
      res.status(201).json({
        status: 'success',
        data: { id: recargaId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating recarga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getRecargaById(req, res) {
    try {
      const recarga = await RecargasCombustible.findById(req.params.id);
      if (!recarga) {
        return res.status(404).json({
          status: 'error',
          message: 'Recarga not found'
        });
      }
      res.json({
        status: 'success',
        data: recarga
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching recarga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateRecarga(req, res) {
    try {
      const { vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id } = req.body;
      const updated = await RecargasCombustible.update(req.params.id, { vehiculo_id, kilometraje, cantidad, gasolinera, foto_ticket, usuario_id });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Recarga not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Recarga updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating recarga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async deleteRecarga(req, res) {
    try {
      const deleted = await RecargasCombustible.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Recarga not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Recarga deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting recarga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getAllRecargas(req, res) {
    try {
      const recargas = await RecargasCombustible.getAll();
      res.json({
        status: 'success',
        data: recargas
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching recargas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = recargasCombustibleController; 