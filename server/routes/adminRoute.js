const express = require('express');
const { dashboardStats, adminStocks } = require('../controllers/adminController');
const { listUsers } = require('../controllers/userController');
const { allTransactions } = require('../controllers/stockController');
const { adminOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', dashboardStats);
router.get('/users', listUsers);
router.get('/orders', adminOrders);
router.get('/transactions', allTransactions);
router.get('/stocks', adminStocks);

module.exports = router;
