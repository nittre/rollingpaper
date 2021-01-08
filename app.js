const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const CookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');
const {isLoggedIn, isNotLoggedIn} = require('./routes/middlewares');

const authRouter = require('./routes/auth');
const mainRouter = require('./routes/main');

dotenv.config();

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
})
app.set('morgan', 'dev');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}));

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);

app.use('/:user_id', mainRouter);

app.use('/', (req, res, next)=> {
    if(req.isAuthenticated()) {
        return res.redirect(`/${req.user.user_id}`);
    }
    else {
        return res.redirect('/auth/login');
    }
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});