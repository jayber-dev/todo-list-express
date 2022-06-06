const express = require('express');
const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const session = require('express-session')
const { json } = require('express');
const { redirect } = require('express/lib/response');
const { error } = require('console');

// const { router } = require('../app');
const routerIndex = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')

// TODO: make a session
// TODO: build SQL database
// let varified = ""

let users = []

// ------------------------ LOGIN HANDLER FUNCTION----------------------------------
routerIndex.use(session({ secret: '1234', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }))

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
                    // console.log(req.session.user);
                    // res.cookie(`user_id`, `${req.user_id = data.id}`, { expires: new Date(Date.now() + 900000), httpOnly: true })
                return req.user_id = data.id, req.user_logged = true, req.session.user, res.cookie(`user_id`, `${req.user_id = data.id}`, { expires: new Date(Date.now() + 10000), httpOnly: true }), next()
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

routerIndex.post('/interface', validation, function(req, res, next) {
    console.log(req.user_id);
    if (!req.user_logged) {
        res.render('login', { message: '*Fill in correct credentials' });
    } else {
        const sql = db.all(`SELECT * FROM todo WHERE user_id = ${req.user_id}`, (err, rows) => {

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


routerIndex.get('/interface', function(req, res, next) {

    res.sendStatus(200)

})

// --------------------- POST FOR PRIORITY CHANGE ---------------------------------
routerIndex.post("/priority", (req, res, next) => {

    res.sendStatus(200)
    db.run(`UPDATE todo
            SET priority = ?
            WHERE id = ?`,
        req.body.priority, req.body.id)
})

// -------------------- POST METHOD DELETE LIST ITEM HANDLER -----------------------
routerIndex.post('/handle', (req, res, next) => {
    console.log(req.session.id)
    res.sendStatus(200)
    db.run(`DELETE FROM todo 
            WHERE id = ?`,
        req.body.itemId)
})

// ------------------- POST METHOD FOR ADDING ITEMS TO LIST HANDLER ----------------
routerIndex.post('/addItem', (req, res, next) => {
    console.log(req.session.id)
    res.sendStatus(200)
    console.log("im inside the additem")
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO todo
                                 (task, priority,user_id) 
                                 VALUES('${req.body.content}',1,${req.body.user_id})`)
        stmt.run()
        stmt.finalize()
    })
})


// ----------------------------- REGISTRATION HANDLING ----------------------------------

routerIndex.post('/register', function(req, res, next) {
    res.sendStatus(200)
    console.log(req.session.id)
    db.run(`INSERT INTO users (fname, lname, email, country, hash_password) VALUES(?,?,?,?,?);`, [req.body.fname, req.body.lname, req.body.email, req.body.country, req.body.pass])
    console.log('im in register func');
    console.log(req.body);
    res.redirect('tasks')
})


module.exports = routerIndex;