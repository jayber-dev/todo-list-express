const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
var app = express();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')
const bcrypt = require('bcrypt')


const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.POST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 10000000,
    insecureAuth: true,
})


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

const test = (req, res, next) => {
    const sql = `SELECT * FROM users WHERE email = ?`
    const rows = connection.query(sql, [req.body.email], (err, rows) => {
        if (err) { console.log(err); }
        const result = bcrypt.compare(req.body.pass, rows[0].hash_password)
        console.log(result.then(() => {
            if (result) {
                console.log('im true');
            }
        }));
        const loggedUser = { userId: rows[0].id, email: rows[0].email, fname: rows[0].fname, lname: rows[0].lname, isLogged: true }
            // users.push(loggedUser)
        req.session.user = loggedUser
        return req.user_id = rows[0].id, req.user_logged = true, req.session.user, res.cookie(`userId`, `${req.user_id = rows.id}`, 'isLogged', 'true', { expires: new Date(Date.now() + 60000), httpOnly: true }), next()
    })
    console.log(rows);
}

const validation = function(req, res, next) {
        req.user_logged = true
        console.log(req.body)
        const sql = `SELECT * FROM users WHERE email = ?`
        if (req.body.email !== '' || req.body.pass !== '') {
            connection.query(sql, req.body.email, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return next();
                }

                if (typeof rows[0] == 'undefined') {
                    req.user_logged = false;
                    return next()
                } else if (req.body.pass !== "") {
                    const wow = bcrypt.compare(req.body.pass, rows[0].hash_password).then((wow) => {
                        if (wow) {
                            console.log('got to wow == true');
                            const loggedUser = { userId: rows[0].id, email: rows[0].email, fname: rows[0].fname, lname: rows[0].lname, isLogged: true }
                                // users.push(loggedUser)
                            req.session.user = loggedUser
                            return req.user_id = rows[0].id, req.user_logged = true, req.session.user, res.cookie(`userId`, `${req.user_id = rows.id}`, 'isLogged', 'true', { expires: new Date(Date.now() + 60000), httpOnly: true }), next()
                        } else {
                            return req.user_logged = false, next()
                        }
                    })

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
        jslink: '../javascripts/login.js',
        message: req.session.message
    });
});

app.post('/', validation, function(req, res) {
    console.log('back in  / function');
    if (!req.user_logged) {
        console.log('validatin refused');
        req.session.message = "Please fill in credentials"
        console.log(req.session.message);
        res.render('login', {
            message: req.session.message,
            csslink: '../stylesheets/login.css',
            jslink: '../javascripts/login.js',
        });

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