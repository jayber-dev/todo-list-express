const express = require('express');
// const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const session = require('express-session')
const { json } = require('express');
// const { redirect } = require('express/lib/response');
const { error } = require('console');
const req = require('express/lib/request');
const mysql = require('mysql2');
const res = require('express/lib/response');
const { sendStatus } = require('express/lib/response');
const bcrypt = require('bcrypt');
// const { router } = require('../app');
const routerIndex = express.Router();

// TODO: build MYSQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '4306',
    password: '',
    database: 'todo',
})

let users = []
routerIndex.use(session({ secret: '1234', cookie: { maxAge: 10 * 900000 }, resave: false, saveUninitialized: true }))

// ------------------------ LOGIN HANDLER FUNCTION----------------------------------

const validation = (req, res, next) => {
    req.user_logged = true
    if (req.body.email !== '' || req.body.pass !== '') {
        connection.query(`SELECT id, email, hash_password, fname, lname From users WHERE email = ?`, [req.body.email], function(err, data) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return next();
            }
            if ('undefined' === typeof data) {
                req.user_logged = false;
                return next()
            } else if (req.body.pass == data.hash_password) {
                const loggedUser = { userId: data.id, email: data.email, fname: data.fname, lname: data.lname }
                users.push(loggedUser)
                req.session.user = loggedUser
                return req.user_id = data.id, req.user_logged = true, req.session.user, res.cookie(`user_id`, `${req.user_id = data.id}`, { expires: new Date(Date.now() + 0), httpOnly: true }), next()
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


// -------------------------- MAIN TASKS PAGE ------------------------------------------

routerIndex.get('/interface', function(req, res, next) {
    console.log(req.sessionID);
    console.log(req.session.user);
    if (!req.session.user) {
        req.session.message = "Fill in credentials"
        console.log(req.session.message);
        res.render('login', {
            message: req.session.message,
            csslink: '../stylesheets/login.css',
            jslink: '../javascripts/login.js',
        });
    } else {
        connection.query(`SELECT * FROM todo WHERE user_id = ${req.session.user['userId']}`, (err, rows) => {

            if (err) {
                throw err
            }
            res.render('index', {
                title: "Manage your tasks",
                toList: rows,
                user_id: req.user_id,
                csslink: '../stylesheets/style.css',
                jslink: '/javascripts/index.js'
            });
        });
    }
})

// --------------------- POST FOR PRIORITY CHANGE ---------------------------------
routerIndex.post("/priority", (req, res, next) => {
    console.log(req.body);
    res.sendStatus(200)
    connection.query(`UPDATE todo SET priority = ? WHERE itemId = ?`, [req.body.priority, req.body.itemId])
})

// -------------------- POST METHOD DELETE LIST ITEM HANDLER -----------------------
routerIndex.post('/handle', (req, res, next) => {
    console.log(req.session.id)
    console.log(req.body.itemId);
    // res.sendStatus(200)
    let sql = 'DELETE FROM `todo` WHERE itemId = ?'
    console.log('im in delete method');
    connection.query(sql, [req.body.itemId], err => {
            if (err) { console.log(err); } else { console.log('yes'); }
        })
        // connection.query('DELETE FROM `todo` WHERE itemId = ?', [req.body.itemId], err => {
        //     if (err) { console.log(err); } else { console.log('yes'); }
        // })
    res.sendStatus(200)
})


// ------------------- POST METHOD FOR ADDING ITEMS TO LIST HANDLER ---------------- WORK
routerIndex.post('/addItem', (req, res, next) => {

    connection.query(`INSERT INTO todo
                 (itemId, task, priority, user_id) 
                 VALUES(?,?,?,?)`, [req.body.itemId, req.body.content, 1, req.session.user['userId']])

    res.sendStatus(200)

})


// ----------------------------- REGISTRATION HANDLING ----------------------------------

routerIndex.post('/register', async function(req, res, next) {
    const saltRounds = 10;
    console.log(req.body.pass);
    const myPlaintextPassword = req.body.pass;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        if (err) { console.log(err + 'problem with hashing your password'); }
        console.log(hash);
        connection.query(`INSERT INTO users (fname, lname, email, country, hash_password) VALUES(?,?,?,?,?);`, [req.body.fname, req.body.lname, req.body.email, req.body.country, hash], (err) => {
            if (err) {
                console.log('unique constraint error');
                res.setHeader('content-type', 'text/html')
                    // res.render('login', { message: "Email already exists" })
                req.session.message = "Email is already exist"
                console.log(req.session.message);
                res.redirect('/')
            }
        });
    });

    res.redirect('/')
})

routerIndex.get('/logout', (req, res, next) => {
    req.session.user = ""
    res.redirect('/')
})


module.exports = routerIndex;