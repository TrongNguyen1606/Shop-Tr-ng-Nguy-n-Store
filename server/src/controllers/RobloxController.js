const { verifyRobloxUsername } = require('../services/robloxApi');

exports.verifyUsername = async (req, res) => {
  const { username } = req.query;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Game ID không hợp lệ' });
  }
  try {
    const result = await verifyRobloxUsername(username.trim());
    res.json(result);
  } catch {
    res.status(404).json({ error: 'Không tìm thấy tài khoản Roblox này' });
  }
};
