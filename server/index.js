const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');
const stockRoutes = require('./routes/stockRoute');
const portfolioRoutes = require('./routes/portfolioRoute');
const transactionRoutes = require('./routes/transactionRoute');
const orderRoutes = require('./routes/orderRoute');
const adminRoutes = require('./routes/adminRoute');
const { seedFallbackStocks } = require('./services/stockService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SB Stocks API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

async function startServer() {
  await connectDB();
  await seedFallbackStocks();
  app.listen(PORT, () => {
    console.log(`SB Stocks server running on port ${PORT}`);
  });
}

startServer();
