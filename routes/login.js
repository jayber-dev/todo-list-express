var express = require('express');
const app = require('../app');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')


/* GET home page. */

// router.post('/validate', function(req, res, next) {
//     console.log(req.session.id)
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
//     res.redirect('/interface')
//     console.log(dbData);

// })




module.exports = router;