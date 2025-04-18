const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Authentication routes
router.post('/registrar', authController.registrar);
router.post('/iniciar-sesion', authController.iniciarSesion);

module.exports = router; 