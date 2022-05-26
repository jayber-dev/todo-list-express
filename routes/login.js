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



module.exports = router;