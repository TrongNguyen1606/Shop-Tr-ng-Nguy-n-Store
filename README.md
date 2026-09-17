# GameShop — Roblox / UGPhone Services

Full-stack: Next.js (App Router) + Node/Express + MongoDB.

## Cấu trúc
- `server/` — Express API (auth, products, orders, card topup, admin recon, discord webhook)
- `client/` — Next.js frontend (shop, login, profile, transactions, admin dashboard)

## Chạy local

### 1. MongoDB
Cài MongoDB local hoặc dùng MongoDB Atlas, lấy connection string.

### 2. Server
```
cd server
cp .env.example .env      # điền các giá trị thật: MONGO_URI, JWT_SECRET, GOOGLE_*, DISCORD_*, MAIL_*, CARD_*
npm install
npm run seed:owner        # tạo tài khoản Owner đầu tiên (đọc OWNER_EMAIL/OWNER_INIT_PASSWORD trong .env)
npm run dev
```
Server chạy ở http://localhost:5000

### 3. Client
```
cd client
cp .env.local.example .env.local
npm install
npm run dev
```
Client chạy ở http://localhost:3000

## Việc cần làm trước khi lên production
1. **Card topup**: `server/src/services/cardTopupService.js` — hàm `buildSignature` hiện là khung mẫu.
   Phải thay bằng đúng công thức ký (HMAC/MD5/SHA...) theo tài liệu API thật của NCC bạn dùng (Card2K/Thesieutoc/Doithe1s...).
2. **Google OAuth**: tạo OAuth Client ID tại Google Cloud Console, thêm redirect URI
   `http://localhost:5000/api/auth/google/callback` (và domain thật khi deploy).
3. **Discord OAuth + Webhook**: tạo Application tại Discord Developer Portal, lấy Client ID/Secret,
   và tạo Webhook URL trong kênh admin để nhận thông báo đơn hàng/nạp tiền.
4. **Gmail OTP**: bật "App Password" cho tài khoản Gmail dùng gửi mail (không dùng mật khẩu Gmail thường).
5. **Owner 2FA**: đã có khung `requireOwner2FA` gợi ý trong tài liệu — nên bật TOTP bắt buộc cho thao tác
   cộng/trừ tiền và khóa tài khoản.
6. **Sau khi seed owner xong**: xoá `OWNER_INIT_PASSWORD` khỏi `.env` server.
7. **HTTPS + cookie `secure: true`** khi deploy production (đã set theo `NODE_ENV`).

## Tài khoản mặc định
Sau khi chạy `npm run seed:owner`, đăng nhập bằng `OWNER_EMAIL` / `OWNER_INIT_PASSWORD` đã khai trong `.env`,
sau đó tự đổi mật khẩu (nên thêm route đổi mật khẩu nếu cần — chưa có sẵn trong bản này).
