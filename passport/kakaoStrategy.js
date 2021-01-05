const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        callbackURL: '/auth/kakao/callback',
        clientID: process.env.KAKAO_ID,
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const exUser = await User.findOne({where: {sns_id: profile.id}});
            if(exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json.kakao_account.email,
                    nickname: profile.username,
                    sns_id: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }        
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};