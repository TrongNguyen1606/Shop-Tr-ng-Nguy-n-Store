const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { verifyToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const { checkoutLimiter } = require('../middlewares/rateLimit');

router.post('/checkout', verifyToken, checkoutLimiter, OrderController.checkout);
router.get('/mine', verifyToken, OrderController.myOrders);

router.get('/', verifyToken, requireRole('admin'), OrderController.getAll);
router.patch('/:id/status', verifyToken, requireRole('admin'), OrderController.updateStatus);

module.exports = router;
