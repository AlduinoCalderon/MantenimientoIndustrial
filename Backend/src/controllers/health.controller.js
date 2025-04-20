const axios = require('axios');
const { pool } = require('../config/database');

// Función auxiliar para verificar la base de datos
async function checkDatabase() {
  try {
    await pool.execute('SELECT 1');
    return true;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
}

class HealthController {
  static async checkHealth(req, res) {
    try {
      // Responder inmediatamente con el estado del servidor
      const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: await checkDatabase(),
        message: 'La petición al endpoint externo se realizará en 5 minutos'
      };
      
      res.json(healthStatus);
      
      // Programar la llamada al endpoint externo para después de 5 minutos
      setTimeout(async () => {
        try {
          const response = await axios.get('https://coldstoragehub.onrender.com/api/health');
          console.log('✅ Petición al endpoint externo completada después de 5 minutos');
          console.log('📦 Respuesta del endpoint externo:', JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error('❌ Error en la petición al endpoint externo:', error.message);
          if (error.response) {
            console.error('📦 Respuesta del error:', JSON.stringify(error.response.data, null, 2));
          }
        }
      }, 300000);
      
    } catch (error) {
      console.error('Error in health check:', error);
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        error: error.message
      });
    }
  }
}

module.exports = HealthController; 