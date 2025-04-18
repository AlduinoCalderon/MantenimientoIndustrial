const Vehiculos = require('../models/vehiculos.model');

const vehiculosController = {
  async createVehiculo(req, res) {
    try {
      const { modelo, placas } = req.body;
      const vehiculoId = await Vehiculos.create({ modelo, placas });
      res.status(201).json({
        status: 'success',
        data: { id: vehiculoId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating vehiculo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getVehiculoById(req, res) {
    try {
      const vehiculo = await Vehiculos.findById(req.params.id);
      if (!vehiculo) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehiculo not found'
        });
      }
      res.json({
        status: 'success',
        data: vehiculo
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching vehiculo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateVehiculo(req, res) {
    try {
      const updated = await Vehiculos.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehiculo not found or no changes made'
        });
      }
      res.json({
        status: 'success',
        message: 'Vehiculo updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating vehiculo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async deleteVehiculo(req, res) {
    try {
      const deleted = await Vehiculos.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehiculo not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Vehiculo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting vehiculo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getAllVehiculos(req, res) {
    try {
      const vehiculos = await Vehiculos.getAll();
      res.json({
        status: 'success',
        data: vehiculos
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching vehiculos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = vehiculosController; 