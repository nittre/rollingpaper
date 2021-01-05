const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_SECRET_KEY,
        callbackURL: '/auth/twitter/callback',
        includeEmail: true
    }, async(token, tokenSecret, profile, cb) => {
        try{
            const exUser = await User.findOne({where: {email: profile.emails[0].value, provider: 'twitter'}});
            if (exUser) {
                cb(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile.emails[0].value,
                    nickname: profile.displayName,
                    sns_id: profile.id,
                    provider: 'twitter',
                });
                cb(null, newUser);
            }
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }));
};