const express = require('express');
const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const session = require('express-session')
const { json } = require('express');
const { redirect } = require('express/lib/response');
const { error } = require('console');
const req = require('express/lib/request');

// const { router } = require('../app');
const routerIndex = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')

// TODO: make a session
// TODO: build SQL database
// let varified = ""

let users = []
routerIndex.use(session({ secret: '1234', cookie: { maxAge: 10 * 900000 }, resave: false, saveUninitialized: true }))

// ------------------------ LOGIN HANDLER FUNCTION----------------------------------

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
        res.render('login', { message: '*Fill in correct credentials' });
    } else {
        const sql = db.all(`SELECT * FROM todo WHERE user_id = ${req.session.user['userId']}`, (err, rows) => {

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
    db.run(`UPDATE todo
            SET priority = ?
            WHERE itemId = ?`,
        req.body.priority, req.body.itemId)
})

// -------------------- POST METHOD DELETE LIST ITEM HANDLER -----------------------
routerIndex.post('/handle', (req, res, next) => {
    console.log(req.session.id)
    res.sendStatus(200)
    db.run(`DELETE FROM todo 
            WHERE itemId = ?`,
        req.body.itemId)
})

// ------------------- POST METHOD FOR ADDING ITEMS TO LIST HANDLER ----------------
routerIndex.post('/addItem', (req, res, next) => {
    console.log(req.session.id)
    console.log(req.body.itemId);
    console.log("im inside the additem")
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO todo
                                 (itemId, task, priority, user_id) 
                                 VALUES(?,?,?,?)`, [req.body.itemId, req.body.content, 1, req.session.user['userId']])
            //  req.body.user_id
            // ${req.body.content}', 1, ${req.session.user['userId']}
        stmt.run()
        stmt.finalize()
        res.sendStatus(200)
    })
})


// ----------------------------- REGISTRATION HANDLING ----------------------------------

routerIndex.post('/register', function(req, res, next) {

    console.log(req.session.id)
    try {
        db.serialize(async() => {
            try {
                var stmt = db.prepare(`INSERT INTO users (fname, lname, email, country, hash_password) VALUES(?,?,?,?,?);`, [req.body.fname, req.body.lname, req.body.email, req.body.country, req.body.pass]);
            } catch (err) {
                console.log(err);
            } finally {
                stmt.run()
                stmt.finalize()
            }
        })
        console.log('im in register func');
        console.log(req.body);
        res.redirect('/')
    } catch (err) {
        console.log(err);
        // res.render('login', { message: "email already exist" })
    }


    // res.render('login', { message: '<p style="color:blue">Thank you for registering</p>' })
})

routerIndex.get('/logout', (req, res, next) => {
    req.session.user = ""
    res.redirect('/')
})

module.exports = routerIndex;