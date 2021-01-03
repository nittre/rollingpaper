const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8000);
app.set('view engine', 'html');
nunjucks.configure({
    express: app,
    watch: true
})
app.use('morgan', 'dev');
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
