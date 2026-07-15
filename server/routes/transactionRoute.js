const express = require('express');
const { buyStock, sellStock, transactionHistory, allTransactions } = require('../controllers/stockController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/history', transactionHistory);
router.get('/all', adminOnly, allTransactions);

module.exports = router;
