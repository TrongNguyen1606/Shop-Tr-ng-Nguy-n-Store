const axios = require('axios');

async function verifyRobloxUsername(username) {
  const resolveRes = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: true,
  });

  const found = resolveRes.data?.data?.[0];
  if (!found) throw new Error('not_found');

  const thumbRes = await axios.get('https://thumbnails.roblox.com/v1/users/avatar-headshot', {
    params: { userIds: found.id, size: '150x150', format: 'Png', isCircular: false },
  });

  const avatarUrl = thumbRes.data?.data?.[0]?.imageUrl || null;

  return {
    userId: found.id,
    displayName: found.displayName || found.name,
    avatarUrl,
  };
}

module.exports = { verifyRobloxUsername };
