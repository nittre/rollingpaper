exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인을 먼저 하셔야 합니다');
        res.redirect(`/auth/login?loginError=${message}`);
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated() || req.query.loginError) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다');
        res.redirect(`/${req.user.user_id}?error=${message}`);
    }
}

exports.isItMe = (req, res, next) => {
    if(req.user.user_id == req.params.user_id) {
        next();
    } else {
        const message = encodeURIComponent('접근 권한이 없죠? ㅋㅋㄹㅃㅃ');
        res.redirect(`/auth/login?loginError=${message}`);
    }
}