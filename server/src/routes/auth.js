const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimit');

router.post('/register', authLimiter, AuthController.register);
router.post('/verify-email', authLimiter, AuthController.verifyEmailOtp);
router.post('/login', authLimiter, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', verifyToken, AuthController.me);

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=locked' }),
  (req, res) => {
    AuthController.issueToken(res, req.user);
    res.redirect(process.env.CLIENT_URL + '/shop');
  }
);

// Discord link — bắt buộc đã đăng nhập
router.get('/discord', verifyToken, passport.authenticate('discord', { session: false }));
router.get('/discord/callback',
  verifyToken,
  passport.authenticate('discord', { session: false, failureRedirect: '/profile?error=link_failed' }),
  (req, res) => res.redirect(process.env.CLIENT_URL + '/profile?linked=discord')
);

module.exports = router;
