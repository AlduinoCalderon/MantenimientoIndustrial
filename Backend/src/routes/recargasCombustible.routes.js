const express = require('express');
const recargasCombustibleController = require('../controllers/recargasCombustible.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for recargas_combustible
router.post('/', checkRole(['Administrador', 'Trabajador']), recargasCombustibleController.createRecarga);
router.get('/', checkRole(['Administrador', 'Cliente']), recargasCombustibleController.getAllRecargas);
router.get('/:id', checkRole(['Administrador', 'Cliente']), recargasCombustibleController.getRecargaById);
router.put('/:id', checkRole(['Administrador']), recargasCombustibleController.updateRecarga);
router.delete('/:id', checkRole(['Administrador']), recargasCombustibleController.deleteRecarga);

module.exports = router; 