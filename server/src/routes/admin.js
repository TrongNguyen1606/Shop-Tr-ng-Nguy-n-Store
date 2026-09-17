const express = require('express');
const router = express.Router();
const AdminReconController = require('../controllers/AdminReconController');
const { verifyToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

router.get('/recon/orders', verifyToken, requireRole('admin'), AdminReconController.getOrderStats);
router.get('/recon/cards', verifyToken, requireRole('admin'), AdminReconController.getCardReconciliation);
router.post('/coupons', verifyToken, requireRole('admin'), AdminReconController.createCoupon);
router.get('/coupons', verifyToken, requireRole('admin'), AdminReconController.listCoupons);

module.exports = router;
