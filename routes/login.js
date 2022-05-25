var express = require('express');
const app = require('../app');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {
        csslink: '../stylesheets/login.css',
        jslink: '/javascripts/login.js'
    });
});

// ------------------------- REGISTER AND LOGIN HANDLING ----------------------------------



router.post('/enter', function(req, res, next) {
    console.log("inside the enter function");
    const data = db.get(`SELECT id, email, hash_password From users WHERE email = ?`, [req.body.email], (err, data) => {
        if (err) { throw err }
        if (req.body.pass == data.hash_password) {

            console.log(data);
            res.redirect('/tasks')
        } else {
            console.log("pass not match");
            res.redirect('/')
        }
    })


})

router.post('/register', function(req, res, next) {

    db.run(`INSERT INTO users fname, lname, email, country, hash_password VALUES(?,?,?,?,?);`, [req.body.fname, req.body.lname, req.body.email, req.body.country, req.body.pass])

    console.log('im in register func');
    console.log(req.body);
    res.redirect('tasks')
})



module.exports = router;