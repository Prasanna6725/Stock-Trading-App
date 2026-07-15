const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/userModel');

async function createAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log('Admin account already exists');
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

  await User.create({
    username: 'Admin',
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    password,
    contact: '',
    role: 'admin',
    balance: 100000,
  });

  console.log('Admin account created successfully');
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error('Admin creation failed:', error.message);
  process.exit(1);
});
