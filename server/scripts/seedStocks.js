const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const { seedFallbackStocks } = require('../services/stockService');

async function seed() {
  await connectDB();
  await seedFallbackStocks();
  console.log('Seeded demo stock data successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
