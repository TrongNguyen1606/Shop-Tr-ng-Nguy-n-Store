require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

async function seedOwner() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_INIT_PASSWORD;

  if (!email || !password) {
    console.error('Thiếu OWNER_EMAIL hoặc OWNER_INIT_PASSWORD trong .env');
    process.exit(1);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Owner đã tồn tại, bỏ qua.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    email: email.toLowerCase(),
    passwordHash,
    emailVerified: true,
    role: 'owner',
  });

  console.log(`Owner account created: ${email}`);
  console.log('Nhớ xoá OWNER_INIT_PASSWORD khỏi .env sau khi chạy xong.');
  process.exit(0);
}

seedOwner();
