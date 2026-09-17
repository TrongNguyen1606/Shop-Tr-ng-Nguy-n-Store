const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const RobloxController = require('../controllers/RobloxController');
const { verifyToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const { verifyGameIdLimiter } = require('../middlewares/rateLimit');

router.get('/', ProductController.list);
router.get('/:slug', ProductController.getBySlug);
router.post('/', verifyToken, requireRole('admin'), ProductController.create);
router.patch('/:id', verifyToken, requireRole('admin'), ProductController.update);
router.delete('/:id', verifyToken, requireRole('admin'), ProductController.remove);

router.get('/roblox/verify', verifyToken, verifyGameIdLimiter, RobloxController.verifyUsername);

module.exports = router;
