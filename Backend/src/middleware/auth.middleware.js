const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token is not valid'
    });
  }
};

// Middleware to check user role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  checkRole
}; 