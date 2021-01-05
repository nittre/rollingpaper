const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET_CODE,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email']
    }, async(accessToken, refreshToken, profile, cb) => {
        try{            
            const exUser = await User.findOne({where: {email: profile.emails[0].value}});
            if (exUser) {
                cb(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile.emails[0].value,
                    nickname: profile.displayName,
                    sns_id: profile.id,
                    provider: 'facebook',
                });
                cb(null, newUser);
            
            }
            
        } catch (err) {
            console.error(err);
            cb(err);
        }
    }));
};