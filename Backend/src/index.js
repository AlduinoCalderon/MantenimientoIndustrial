require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { default: chalk } = require('chalk');
const figlet = require('figlet');
const { testConnection } = require('./config/database');

const app = express();

// Función para mostrar el banner de inicio
const showBanner = () => {
  console.log(
    chalk.blue(
      figlet.textSync('Mantenimiento Industrial', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log(chalk.green('🚀 Iniciando servidor...'));
  console.log(chalk.yellow('⚙️  Configurando middleware...'));
};

// Middleware para logging de peticiones y respuestas
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Registrar la petición entrante
  console.log(
    chalk.cyan('📥 Petición:') + ' ' +
    chalk.yellow(req.method) + ' ' +
    chalk.white(req.originalUrl) + ' ' +
    chalk.magenta('[' + new Date().toISOString() + ']')
  );
  
  // Mostrar headers de autenticación
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log(
      chalk.cyan('🔑 Token:') + ' ' +
      chalk.gray(authHeader.substring(0, 20) + '...')
    );
  } else {
    console.log(
      chalk.yellow('⚠️  No se encontró token de autenticación')
    );
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(
      chalk.cyan('📦 Body:') + '\n' +
      chalk.gray(JSON.stringify(req.body, null, 2))
    );
  }

  // Interceptar la respuesta
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? chalk.red : chalk.green;
    
    // Registrar la respuesta
    console.log(
      chalk.cyan('📤 Respuesta:') + ' ' +
      statusColor(res.statusCode) + ' ' +
      chalk.white(duration + 'ms')
    );
    
    try {
      const responseBody = JSON.parse(body);
      if (responseBody.status === 'error' && responseBody.message === 'No authentication token, access denied') {
        console.log(
          chalk.red('❌ Error de autenticación:') + '\n' +
          chalk.yellow('Por favor, incluye un token de autenticación válido en el header "Authorization"')
        );
      } else {
        console.log(
          chalk.green('✅ Respuesta:') + '\n' +
          chalk.gray(JSON.stringify(responseBody, null, 2))
        );
      }
    } catch (e) {
      console.log(
        chalk.green('✅ Respuesta:') + '\n' +
        chalk.gray(body)
      );
    }
    
    console.log(chalk.gray('─'.repeat(80)));
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Middleware
app.use(cors({
  origin: '*', // Allow connections from any origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Agregar el middleware de logging

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR)));

// Use routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(chalk.red('❌ Error:', err.stack));
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    showBanner();
    
    // Probar conexión a la base de datos
    await testConnection();
    console.log(chalk.green('✅ Conexión a la base de datos establecida'));
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(chalk.green(`✅ Servidor corriendo en puerto ${PORT}`));
      console.log(chalk.blue('📡 API disponible en:'));
      console.log(chalk.cyan(`   http://localhost:${PORT}/api`));
      console.log(chalk.yellow('\n👀 Esperando peticiones...'));
    });
  } catch (error) {
    console.error(chalk.red('❌ Error al iniciar el servidor:', error));
    process.exit(1);
  }
};

startServer(); 