const express = require('express');
const coockie = require('cookie-parser')
const { send } = require('process');
const app = require('../app');
const session = require('express-session')
const { json } = require('express');
const { redirect } = require('express/lib/response');
// const { router } = require('../app');
const routerIndex = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')

// TODO: check sqlite at work for progress
// TODO: build SQL database
// let varified = ""

exports.validation = (req, res, next) => {
    req.user_logged = true
    console.log(req.body.email);
    const dbData = db.get(`SELECT id, email, hash_password, fname, lname From users WHERE email = ?`, [req.body.email], function(err, data) {
        console.log(data);
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return next();
        }

        if (req.body.pass == data.hash_password) {
            req.user_id = data.id
            req.user_logged = true;
            next()

        } else {
            req.user_logged = false;
            next()
        }
    })
}

routerIndex.post('/interface', this.validation, function(req, res, next) {
    // console.log(req.params);
    console.log(req.user_logged);
    if (!req.user_logged) res.redirect('/');

    const sql = db.all(`SELECT * FROM todo WHERE user_id = ${req.user_id}`, (err, rows) => {

        if (err) {
            throw err
        }
        res.render('index', {
            title: "Manage your tasks",
            toList: rows,
            user_id: req.params.id,
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

// routerIndex.post('/', function(req, res, next) {
//     console.log(req.session.id)
//     res.sendStatus(200)
//         // res.setHeader([req.session.cookie])
//     const dbData = db.get(`SELECT id, email, hash_password From users WHERE email = ?`, [req.body.email], function(err, data) {
//         if (err) { throw err }

//         if (data == undefined) {
//             res.render('login')
//         } else if (req.body.pass == data.hash_password) {

//             console.log(data);
//             res.redirect('/tasks')
//         } else {
//             console.log("pass not match");
//             res.redirect('/')
//         }
//     })
//     res.redirect('/')
//     console.log(dbData);

// })

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