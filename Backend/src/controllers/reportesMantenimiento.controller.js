const ReportesMantenimiento = require('../models/reportesMantenimiento.model');

const reportesMantenimientoController = {
  async createReporte(req, res) {
    try {
      const { equipo_id, descripcion, tipo, evidencias, usuario_id } = req.body;
      const reporteId = await ReportesMantenimiento.create({ equipo_id, descripcion, tipo, evidencias, usuario_id });
      res.status(201).json({
        status: 'success',
        data: { id: reporteId }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getReporteById(req, res) {
    try {
      const reporte = await ReportesMantenimiento.findById(req.params.id);
      if (!reporte) {
        return res.status(404).json({
          status: 'error',
          message: 'Reporte not found'
        });
      }
      res.json({
        status: 'success',
        data: reporte
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateReporte(req, res) {
    try {
      const { equipo_id, descripcion, tipo, evidencias, usuario_id } = req.body;
      const updated = await ReportesMantenimiento.update(req.params.id, { equipo_id, descripcion, tipo, evidencias, usuario_id });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Reporte not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Reporte updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async deleteReporte(req, res) {
    try {
      const deleted = await ReportesMantenimiento.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Reporte not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Reporte deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting reporte',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getAllReportes(req, res) {
    try {
      const reportes = await ReportesMantenimiento.getAll();
      res.json({
        status: 'success',
        data: reportes
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching reportes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getReportesByClienteId(req, res) {
    try {
      const { cliente_id } = req.params;
      const reportes = await ReportesMantenimiento.findByClienteId(cliente_id);
      res.json({
        status: 'success',
        data: reportes
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching reports',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = reportesMantenimientoController; 