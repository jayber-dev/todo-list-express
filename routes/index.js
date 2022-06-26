const express = require('express');
const app = require('../app');
const session = require('cookie-session')
const req = require('express/lib/request');
const mysql = require('mysql2/promise');
const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const routerIndex = express.Router();
let users = []


routerIndex.use(session({
    name: "session",
    keys: [process.env.SECRET_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    // secret: `${process.env.SECRET_KEY}`,
    // cookie: { maxAge: 10 * 900000 },
    // resave: false,
    // saveUninitialized: false
}));

// ------------------------ LOGIN HANDLER FUNCTION----------------------------------

const validation = (req, res, next) => {
    req.user_logged = true;
    if (req.body.email !== '' || req.body.pass !== '') {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,

            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            // connectTimeout: 0,
            insecureAuth: true,
        }).then((connection) => {
            connection.query(`SELECT id, email, hash_password, fname, lname From users WHERE email = ?`, [req.body.email], (connection) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return next();
                }
                if ('undefined' === typeof data) {
                    req.user_logged = false;
                    return next()
                } else if (req.body.pass == data.hash_password) {
                    const loggedUser = { userId: data.id, email: data.email, fname: data.fname, lname: data.lname };
                    users.push(loggedUser);
                    req.session.user = loggedUser;
                    return req.user_id = data.id, req.user_logged = true, req.session.user, res.cookie(`user_id`, `${req.user_id = data.id}`, { expires: new Date(Date.now() + 0), httpOnly: true }), next();
                } else {
                    req.user_logged = false;
                    next();
                }
            }).catch((err) => {
                console.log(err);
            })
        })
    } else {
        req.user_logged = false;
        next();
    }

}


// -------------------------- MAIN TASKS PAGE ------------------------------------------

routerIndex.get('/interface', function(req, res, next) {
    if (!req.session.user) {
        req.session.message = "Fill in valid credentials";
        res.render('login', {
            message: req.session.message,
            csslink: '../stylesheets/login.css',
            jslink: '../javascripts/login.js',
        });
    } else {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            // connectTimeout: 0,
            insecureAuth: true,
        }).then((connection) => {
            connection.query(`SELECT * FROM todo WHERE user_id = ${req.session.user['userId']}`).then((connection) => {
                res.render('index', {
                    title: "Manage your tasks",
                    toList: connection[0],
                    user_id: req.user_id,
                    csslink: '../stylesheets/style.css',
                    jslink: '/javascripts/index.js'
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    };
});

// --------------------- POST FOR PRIORITY CHANGE ---------------------------------
routerIndex.post("/priority", (req, res, next) => {
    res.sendStatus(200);
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        // connectTimeout: 0,
        insecureAuth: true,
    }).then((connection) => {
        connection.query(`UPDATE todo SET priority = ? WHERE itemId = ?`, [req.body.priority, req.body.itemId]).then((connection) => {

        })
    });
})

// -------------------- POST METHOD DELETE LIST ITEM HANDLER -----------------------
routerIndex.post('/handle', (req, res, next) => {

    let sql = 'DELETE FROM `todo` WHERE itemId = ?';
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        port: process.env.PORT,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        // connectTimeout: 0,
        insecureAuth: true,
    }).then((connection) => {
        connection.query(sql, [req.body.itemId]).then(connection => {
            console.log("log deleted");
        })
    })

    res.sendStatus(200);
})

// ------------------- POST METHOD FOR ADDING ITEMS TO LIST HANDLER ---------------- WORK
routerIndex.post('/addItem', (req, res, next) => {
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        // port: process.env.PORT,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        // connectTimeout: 0,
        insecureAuth: true,
    }).then((connection) => {
        connection.query(`INSERT INTO todo
                 (itemId, task, priority, user_id) 
                 VALUES(?,?,?,?)`, [req.body.itemId, req.body.content, 1, req.session.user['userId']])
    }).catch((err) => {
        console.log(err);
    })

})

// ----------------------------- REGISTRATION HANDLING ----------------------------------

routerIndex.post('/register', async function(req, res, next) {
    const saltRounds = 10;
    const myPlaintextPassword = req.body.pass;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        if (err) { console.log(err + 'problem with hashing your password'); }
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            // connectTimeout: 0,
            insecureAuth: true,
        }).then((connection) => {
            connection.query(`INSERT INTO users (fname, lname, email, country, hash_password) VALUES(?,?,?,?,?);`, [req.body.fname, req.body.lname, req.body.email, req.body.country, hash])
                .then((connection) => { console.log(connection[0]); })
                .catch((err) => {
                    if (err) {
                        console.log('unique constraint error');
                        res.setHeader('content-type', 'text/html');
                        req.session.message = "Email is already exist";
                        res.redirect('/');
                    }
                })
        })
    });
});

// ------------------------------ LOGOUT HANDLER ------------------------------

routerIndex.get('/logout', (req, res, next) => {
    req.session.user = ""
    res.redirect('/')
})


module.exports = routerIndex;