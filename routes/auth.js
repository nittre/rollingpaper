const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.route('/join')
    .get((req, res) => {
        res.render('join', {login: false, title: '회원가입', joinError: req.query.error});
    })
    .post(isNotLoggedIn, async (req, res) => {
        const {email, nickname, password} = req.body;
        try {
            const exUser = await User.findOne({where: {email}});
            if (exUser) {
                const message = '이미 계정이 존재합니다.';
                return res.redirect(`/auth/join?error=${message}`);
            }
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                email,
                nickname,
                password: hash
            });
            return res.redirect('/auth/login');
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

router.route('/login')
    .get((req, res, next) => {
        res.render('main', {login: false, loginError: req.query.loginError});
    })
    .post(isNotLoggedIn, (req, res, next) => {
        passport.authenticate('local', (authError, user, info) => {
            if (authError) {
                console.error(authError);
                return next(authError);
            }
            if (!user) {
                return res.redirect(`/auth/login?loginError=${info.message}`);
            }
            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                return res.redirect(`/${user.user_id}`);
            });
        })(req, res, next);
    });

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/auth/login',
}), (req, res) => {
    res.redirect(`/${req.user.user_id}`);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;