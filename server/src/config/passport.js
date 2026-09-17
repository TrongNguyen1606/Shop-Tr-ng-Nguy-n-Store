const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
      if (user) {
        user.googleId = profile.id;
      } else {
        user = new User({
          email: profile.emails[0].value.toLowerCase(),
          googleId: profile.id,
          emailVerified: true,
          role: 'user',
        });
      }
      await user.save();
    }
    if (user.isLocked) return done(null, false, { message: 'account_locked' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use('discord', new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: '/api/auth/discord/callback',
  scope: ['identify'],
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (!req.user) return done(null, false, { message: 'must_be_logged_in' });
    const currentUserId = req.user._id;

    const alreadyLinked = await User.findOne({ 'discord.id': profile.id });
    if (alreadyLinked && alreadyLinked._id.toString() !== currentUserId.toString()) {
      return done(null, false, { message: 'discord_already_linked' });
    }

    const user = await User.findById(currentUserId);
    user.discord = {
      id: profile.id,
      username: `${profile.username}${profile.discriminator && profile.discriminator !== '0' ? '#' + profile.discriminator : ''}`,
      linkedAt: new Date(),
    };
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
