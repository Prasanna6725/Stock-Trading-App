const User = require('../models/userModel');
const Stock = require('../models/stockSchema');
const Order = require('../models/orderSchema');
const Transaction = require('../models/transactionModel');

async function dashboardStats(req, res) {
  try {
    const [totalUsers, totalStocks, totalOrders, totalTransactions, buyTransactions, sellTransactions] = await Promise.all([
      User.countDocuments({}),
      Stock.countDocuments({}),
      Order.countDocuments({}),
      Transaction.countDocuments({}),
      Transaction.countDocuments({ type: 'BUY' }),
      Transaction.countDocuments({ type: 'SELL' }),
    ]);

    const recentActivity = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username email role')
      .populate('stock', 'symbol name');

    return res.json({
      success: true,
      message: 'Admin dashboard stats fetched',
      data: {
        totalUsers,
        totalStocks,
        totalOrders,
        totalTransactions,
        buyTransactions,
        sellTransactions,
        recentActivity,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch admin dashboard stats' });
  }
}

async function adminStocks(req, res) {
  try {
    const stocks = await Stock.find({}).sort({ symbol: 1 });
    return res.json({ success: true, message: 'Admin stocks fetched', data: stocks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch stocks' });
  }
}

module.exports = { dashboardStats, adminStocks };
