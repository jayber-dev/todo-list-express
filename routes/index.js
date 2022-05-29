const express = require('express');
const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const session = require('express-session')
const { json } = require('express');
const routerIndex = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')

// TODO: check sqlite at work for progress
// TODO: build SQL database

routerIndex.post('/enter', function(req, res, next) {
    console.log(req.session.id)
        // res.setHeader([req.session.cookie])
    const dbData = db.get(`SELECT id, email, hash_password From users WHERE email = ?`, [req.body.email], function(err, data) {
            if (err) { throw err }

            if (data == undefined) {
                res.render('login')
            } else if (req.body.pass == data.hash_password) {
                console.log(data);
                res.redirect('/interface')
            } else {
                console.log("pass not match");
                res.redirect('/')
            }
        })
        // console.log(dbData);
})

// ------------------------------ USER INTERFACE ---------------------------------

routerIndex.get('/interface', function(req, res, next) {
    if (!req.session.id) { res.redirect('/login') }
    console.log(req.session.id)
    console.log(req.session.cookie)
    const sql = db.all('SELECT * FROM todo WHERE user_id = 1', (err, rows) => {
        if (err) {
            throw err
        }
        res.render('index', {
            title: "Manage your tasks",
            toList: rows,
            csslink: '../stylesheets/style.css',
            jslink: '/javascripts/index.js'
        });
    });
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
                                 (task, priority) 
                                 VALUES('${req.body.content}',1)`)
        stmt.run()
        stmt.finalize()
    })
})


// ------------------------- REGISTER AND LOGIN HANDLING ----------------------------------

routerIndex.post('/', function(req, res, next) {
    console.log(req.session.id)
    res.sendStatus(200)
        // res.setHeader([req.session.cookie])
    const dbData = db.get(`SELECT id, email, hash_password From users WHERE email = ?`, [req.body.email], function(err, data) {
        if (err) { throw err }

        if (data == undefined) {
            res.render('login')
        } else if (req.body.pass == data.hash_password) {

            console.log(data);
            res.redirect('/tasks')
        } else {
            console.log("pass not match");
            res.redirect('/')
        }
    })
    res.redirect('/')
    console.log(dbData);

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