const express = require('express');
const { myOrders, adminOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', myOrders);
router.get('/admin', adminOnly, adminOrders);

module.exports = router;
