const express = require('express');
const reportesMantenimientoController = require('../controllers/reportesMantenimiento.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for reportes_mantenimiento
router.post('/', checkRole(['Administrador', 'Trabajador']), reportesMantenimientoController.createReporte);
router.get('/', checkRole(['Administrador', 'Cliente']), reportesMantenimientoController.getAllReportes);
router.get('/:id', checkRole(['Administrador', 'Cliente']), reportesMantenimientoController.getReporteById);
router.put('/:id', checkRole(['Administrador']), reportesMantenimientoController.updateReporte);
router.delete('/:id', checkRole(['Administrador']), reportesMantenimientoController.deleteReporte);

// Additional route
router.get('/cliente/:cliente_id', checkRole(['Administrador', 'Cliente']), reportesMantenimientoController.getReportesByClienteId);

module.exports = router; 