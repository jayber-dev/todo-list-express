const express = require('express');
const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const ses = require('express-session')
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

// ------------------------ LOGIN HANDLER ----------------------------------

exports.validation = (req, res, next) => {
    req.user_logged = true
    console.log(req.body.email);
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
                req.user_id = data.id
                req.user_logged = true;
                next()
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

routerIndex.post('/interface', this.validation, function(req, res, next) {
    // console.log(req.params);
    console.log(req.user_logged);
    if (!req.user_logged) { res.redirect('/'); } else {

        const sql = db.all(`SELECT * FROM todo WHERE user_id = ${req.user_id}`, (err, rows) => {

            if (err) {
                throw err
            }
            console.log(req.sessionID)
            res.cookie(`user_id`, `${req.user_id}`, { expires: new Date(Date.now() + 900000), httpOnly: true })
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
    console.log(req);

    res.sendStatus(401)

})

// --------------------- POST FOR PRIORITY CHANGE ---------------------------------
routerIndex.post("/priority", (req, res, next) => {
    console.log(req.session.id)
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