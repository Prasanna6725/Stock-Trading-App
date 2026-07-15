const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Portfolio = require('../models/portfolioModel');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    contact: user.contact,
    role: user.role,
    balance: user.balance,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function registerUser(req, res) {
  try {
    const { username, email, password, contact } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      contact: contact ? contact.trim() : '',
      role: 'user',
    });

    await Portfolio.create({
      user: user._id,
      name: 'Main Portfolio',
      description: 'Default portfolio created on registration',
      holdings: [],
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: safeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: safeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ success: true, message: 'Profile fetched', data: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch profile' });
  }
}

async function updateProfile(req, res) {
  try {
    const { username, contact } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (username) user.username = username.trim();
    if (typeof contact === 'string') user.contact = contact.trim();
    await user.save();

    return res.json({ success: true, message: 'Profile updated', data: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update profile' });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: 'Users fetched',
      data: users.map((user) => safeUser(user)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch users' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  listUsers,
  safeUser,
  generateToken,
};
