const axios = require('axios');
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function notifyDiscord({ title, fields, color = 0xD946EF }) {
  if (!WEBHOOK_URL) return;
  try {
    await axios.post(WEBHOOK_URL, {
      embeds: [{ title, color, fields, timestamp: new Date().toISOString() }],
    });
  } catch (err) {
    console.error('Discord webhook failed:', err.message);
  }
}

function notifyNewOrder(order, user) {
  const discordTag = user.discord?.username
    ? `${user.discord.username} (đã liên kết Discord)`
    : 'Chưa liên kết Discord';
  return notifyDiscord({
    title: '🛒 Đơn hàng mới',
    fields: [
      { name: 'Khách hàng', value: `${user.email} — ${discordTag}` },
      { name: 'Game ID', value: order.gameId, inline: true },
      { name: 'Tổng tiền', value: `${order.totalAmount.toLocaleString()}đ`, inline: true },
      { name: 'Ghi chú', value: order.noteForAdmin || 'Không có' },
    ],
  });
}

function notifyDepositSuccess(user, amount) {
  const discordTag = user.discord?.username
    ? `${user.discord.username} (đã liên kết Discord)`
    : 'Chưa liên kết Discord';
  return notifyDiscord({
    title: '💵 Nạp tiền thành công',
    color: 0x22C55E,
    fields: [
      { name: 'User', value: `${user.email} — ${discordTag}` },
      { name: 'Số tiền', value: `${amount.toLocaleString()}đ`, inline: true },
    ],
  });
}

function notifyBalanceAdjust(user, amount, note, actor) {
  return notifyDiscord({
    title: amount > 0 ? '💰 Owner cộng tiền' : '⚠️ Owner trừ tiền',
    color: amount > 0 ? 0x22C55E : 0xEF4444,
    fields: [
      { name: 'User', value: user.email, inline: true },
      { name: 'Số tiền', value: `${amount.toLocaleString()}đ`, inline: true },
      { name: 'Thực hiện bởi', value: actor.email },
      { name: 'Ghi chú', value: note || 'Không có' },
    ],
  });
}

module.exports = { notifyDiscord, notifyNewOrder, notifyDepositSuccess, notifyBalanceAdjust };
