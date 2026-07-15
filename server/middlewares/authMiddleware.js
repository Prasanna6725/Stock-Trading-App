const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      role: user.role,
      balance: user.balance,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
}

module.exports = { protect, adminOnly };
