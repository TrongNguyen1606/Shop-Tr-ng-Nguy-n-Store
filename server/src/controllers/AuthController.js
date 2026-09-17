const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

function issueToken(res, user) {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });
}

async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: `"Game Shop" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Mã xác thực đăng ký tài khoản',
    html: `<p>Mã xác thực của bạn là: <b>${otp}</b> (hết hạn sau 10 phút)</p>`,
  });
}

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    return res.status(400).json({ error: 'Chỉ chấp nhận đăng ký bằng địa chỉ Gmail' });
  }
  if (password.length < 8) return res.status(400).json({ error: 'Mật khẩu tối thiểu 8 ký tự' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: 'Email đã được sử dụng' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await User.create({
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
    role: 'user',
    emailVerified: false,
    otpCode: otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error('Gửi email thất bại:', err.message);
  }
  res.json({ message: 'Đã gửi mã xác thực đến Gmail, vui lòng kiểm tra hộp thư' });
};

exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+otpCode +otpExpiresAt');
  if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ error: 'Mã xác thực sai hoặc đã hết hạn' });
  }
  user.emailVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  res.json({ message: 'Xác thực thành công, bạn có thể đăng nhập' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+passwordHash');
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
  if (!user.emailVerified) return res.status(403).json({ error: 'Vui lòng xác thực email trước khi đăng nhập' });
  if (user.isLocked) return res.status(403).json({ error: 'Tài khoản đã bị khóa' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

  issueToken(res, user);
  res.json({ message: 'Đăng nhập thành công', user: { id: user._id, email: user.email, role: user.role } });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đã đăng xuất' });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports.issueToken = issueToken;
