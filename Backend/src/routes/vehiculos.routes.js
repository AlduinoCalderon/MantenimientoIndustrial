const express = require('express');
const vehiculosController = require('../controllers/vehiculos.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for vehiculos
router.post('/', checkRole(['Administrador']), vehiculosController.createVehiculo);
router.get('/', checkRole(['Administrador', 'Cliente']), vehiculosController.getAllVehiculos);
router.get('/:id', checkRole(['Administrador', 'Cliente']), vehiculosController.getVehiculoById);
router.put('/:id', checkRole(['Administrador']), vehiculosController.updateVehiculo);
router.delete('/:id', checkRole(['Administrador']), vehiculosController.deleteVehiculo);

module.exports = router; 