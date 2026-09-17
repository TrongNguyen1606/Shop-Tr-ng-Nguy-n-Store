const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

router.get('/me/transactions', verifyToken, UserController.getMyTransactions);
router.get('/leaderboard/top-deposit', UserController.topDeposit);

router.get('/', verifyToken, requireRole('admin'), UserController.list);
router.post('/:id/adjust-balance', verifyToken, requireRole('owner'), UserController.adjustBalance);
router.patch('/:id/lock', verifyToken, requireRole('owner'), UserController.toggleLock);
router.patch('/:id/role', verifyToken, requireRole('owner'), UserController.updateRole);

module.exports = router;
