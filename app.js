'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
var app = express();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')
const passport = require('passport')

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
const { redirect } = require('express/lib/response');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pics', express.static('public'))


const validation = (req, res, next) => {
        req.user_logged = true
        if (req.body.email !== '' || req.body.pass !== '') {
            const dbData = db.get(`SELECT id, email, hash_password, fname, lname From users WHERE email = ?`, [req.body.email], function(err, data) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return next();
                }
                if ('undefined' === typeof data) {
                    req.user_logged = false;
                    return next()
                } else if (req.body.pass == data.hash_password) {
                    const loggedUser = { userId: data.id, email: data.email, fname: data.fname, lname: data.lname, isLogged: true }
                        // users.push(loggedUser)
                    req.session.user = loggedUser
                    return req.user_id = data.id, req.user_logged = true, req.session.user, res.cookie(`userId`, `${req.user_id = data.id}`, 'isLogged', 'true', { expires: new Date(Date.now() + 60000), httpOnly: true }), next()
                } else {
                    req.user_logged = false;
                    next()
                }
            })
        } else {
            req.user_logged = false;
            next()
        }

    }
    // users = []

app.use('/', indexRouter);
app.use('/login', loginRouter);

app.get('/', function(req, res, next) {
    if (req.session.user) {
        res.redirect('/interface')
    }
    res.render('login', {
        csslink: '../stylesheets/login.css',
        jslink: '/javascripts/login.js'
    });
});

app.post('/', validation, function(req, res) {
    if (!req.user_logged) {
        res.render('login', { message: '*Fill in correct credentials' });
    } else {
        res.cookie('isLogged', true)
        res.redirect('/interface')
    }
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;