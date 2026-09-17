const express = require('express');
const router = express.Router();
const CardController = require('../controllers/CardController');
const { verifyToken } = require('../middlewares/auth');
const { cardChargeLimiter } = require('../middlewares/rateLimit');

router.post('/submit', verifyToken, cardChargeLimiter, CardController.submitCard);
router.get('/status/:requestId', verifyToken, CardController.checkStatus);
router.post('/callback', CardController.handleCallback); // public, verify chữ ký bên trong

module.exports = router;
