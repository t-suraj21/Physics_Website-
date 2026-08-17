const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET environment variable is missing on server' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Query the database to verify the user still exists and has a valid role
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists, authorization denied' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
