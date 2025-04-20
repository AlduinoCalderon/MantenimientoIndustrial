const axios = require('axios');

class HealthController {
  static async checkHealth(req, res) {
    try {
      // Esperar 5 minutos (300,000 milisegundos)
      await new Promise(resolve => setTimeout(resolve, 300000));
      
      // Llamar al endpoint externo
      const response = await axios.get('https://coldstoragehub.onrender.com/api/health');
      
      // Devolver la respuesta del endpoint externo
      res.json(response.data);
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