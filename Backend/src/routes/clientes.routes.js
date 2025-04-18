const express = require('express');
const clientesController = require('../controllers/clientes.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for clientes
router.post('/', checkRole(['Administrador']), clientesController.createCliente);
router.get('/', checkRole(['Administrador']), clientesController.getAllClientes);
router.get('/:id', checkRole(['Administrador']), clientesController.getClienteById);
router.put('/:id', checkRole(['Administrador']), clientesController.updateCliente);
router.delete('/:id', checkRole(['Administrador']), clientesController.deleteCliente);

module.exports = router; 