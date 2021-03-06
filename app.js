const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('cookie-session')
var app = express();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')
const bcrypt = require('bcryptjs');
require('dotenv').config();


const mysql = require('mysql2/promise')

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


const validation = function(req, res, next) {
    req.user_logged = true
    const sql = `SELECT * FROM users WHERE email = ?`
    if (req.body.email !== '' || req.body.pass !== '') {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            connectTimeout: 0,
            insecureAuth: true,
        }).then((connection) => {
            connection.query(sql, req.body.email).then((connection) => {
                console.log(connection[0][0]);
                if (typeof connection[0][0] == 'undefined') {
                    req.user_logged = false;
                    return next()
                } else if (req.body.pass !== "") {
                    const wow = bcrypt.compare(req.body.pass, connection[0][0].hash_password).then((wow) => {
                        if (wow) {
                            console.log('got to wow == true');
                            const loggedUser = { userId: connection[0][0].id, email: connection[0][0].email, fname: connection[0][0].fname, lname: connection[0][0].lname, isLogged: true }
                            req.session.user = loggedUser
                            return req.user_id = connection[0][0].id, req.user_logged = true, req.session.user, res.cookie(`userId`, `${req.user_id = connection[0][0].id}`, 'isLogged', 'true', { expires: new Date(Date.now() + 60000), httpOnly: true }), next()
                        } else {
                            return req.user_logged = false, next();
                        };

                    });
                } else {
                    req.user_logged = false;
                    next();
                };
            })
            console.log("im finishing the connection");
            console.log(connection);
            connection.end()
        });

    } else {
        req.user_logged = false;
        next()
    };

};

app.use('/', indexRouter);
app.use('/login', loginRouter);

app.get('/', function(req, res, next) {
    if (req.session.user) {
        // res.sendStatus(200)
        res.redirect('/interface')
    }
    res.render('login', {
        csslink: '../stylesheets/login.css',
        jslink: '../javascripts/login.js',
        message: req.session.message
    });
});

app.post('/', validation, function(req, res) {

    if (!req.user_logged) {
        console.log('validatin refused');
        req.session.message = "Please fill in credentials"
        res.render('login', {
            message: req.session.message,
            csslink: '../stylesheets/login.css',
            jslink: '../javascripts/login.js',
        });

    } else {
        req.setTimeout(1000, (err) => {
            if (err) console.log(err);
        })
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