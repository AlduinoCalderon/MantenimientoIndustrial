const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CRUD routes for users
router.post('/', checkRole(['Administrador']), usuarioController.crearUsuario);
router.get('/', checkRole(['Administrador']), usuarioController.obtenerTodosLosUsuarios);
router.get('/:id', checkRole(['Administrador']), usuarioController.obtenerUsuarioPorId);
router.put('/:id', checkRole(['Administrador']), usuarioController.actualizarUsuario);
router.delete('/:id', checkRole(['Administrador']), usuarioController.eliminarUsuario);

module.exports = router; 