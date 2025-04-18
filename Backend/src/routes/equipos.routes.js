const express = require('express');
const equiposController = require('../controllers/equipos.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for equipos
router.post('/', checkRole(['Administrador']), equiposController.createEquipo);
router.get('/', checkRole(['Administrador', 'Cliente']), equiposController.getAllEquipos);
router.get('/:id', checkRole(['Administrador', 'Cliente']), equiposController.getEquipoById);
router.put('/:id', checkRole(['Administrador']), equiposController.updateEquipo);
router.delete('/:id', checkRole(['Administrador']), equiposController.deleteEquipo);

module.exports = router; 