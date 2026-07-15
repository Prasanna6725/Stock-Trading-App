const Order = require('../models/orderSchema');

async function myOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('portfolio', 'name')
      .populate('stock', 'symbol name price');
    return res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch orders' });
  }
}

async function adminOrders(req, res) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username email role')
      .populate('portfolio', 'name')
      .populate('stock', 'symbol name price');
    return res.json({ success: true, message: 'All orders fetched', data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch orders' });
  }
}

module.exports = { myOrders, adminOrders };
