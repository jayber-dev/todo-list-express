var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {
        csslink: '../stylesheets/login.css',
        jslink: '/javascripts/login.js'
    });
});

module.exports = router;