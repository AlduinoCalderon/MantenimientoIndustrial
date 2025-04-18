const Equipos = require('../models/equipos.model');

const equiposController = {
  async createEquipo(req, res) {
    try {
      const { nombre, descripcion, cliente_id } = req.body;
      const equipoId = await Equipos.create({ nombre, descripcion, cliente_id });
      res.status(201).json({
        status: 'success',
        data: { id: equipoId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating equipo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getEquipoById(req, res) {
    try {
      const equipo = await Equipos.findById(req.params.id);
      if (!equipo) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipo not found'
        });
      }
      res.json({
        status: 'success',
        data: equipo
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching equipo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateEquipo(req, res) {
    try {
      const updated = await Equipos.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipo not found or no changes made'
        });
      }
      res.json({
        status: 'success',
        message: 'Equipo updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating equipo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async deleteEquipo(req, res) {
    try {
      const deleted = await Equipos.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipo not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Equipo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting equipo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getAllEquipos(req, res) {
    try {
      const equipos = await Equipos.getAll();
      res.json({
        status: 'success',
        data: equipos
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching equipos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = equiposController; 