const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const autenticacionController = {
  async registrar(req, res) {
    try {
      const { nombre, email, contraseña, rol } = req.body;

      // Check if user already exists
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists'
        });
      }

      // Create new user
      const userId = await Usuario.create({
        nombre,
        email,
        contraseña,
        rol
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email, rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: userId,
            nombre,
            email,
            rol
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async iniciarSesion(req, res) {
    try {
      const { email, contraseña } = req.body;

      // Find user
      const user = await Usuario.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(contraseña, user.contraseña);
      if (!isMatch) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error logging in',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = autenticacionController; 