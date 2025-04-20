const express = require('express');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const reportesMantenimientoRoutes = require('./reportesMantenimiento.routes');
const recargasCombustibleRoutes = require('./recargasCombustible.routes');
const clientesRoutes = require('./clientes.routes');
const equiposRoutes = require('./equipos.routes');
const vehiculosRoutes = require('./vehiculos.routes');
const healthRoutes = require('./health.routes');

const router = express.Router();

// Configurar las rutas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/reportes-mantenimiento', reportesMantenimientoRoutes);
router.use('/recargas-combustible', recargasCombustibleRoutes);
router.use('/clientes', clientesRoutes);
router.use('/equipos', equiposRoutes);
router.use('/vehiculos', vehiculosRoutes);
router.use('/health', healthRoutes);

module.exports = router; 