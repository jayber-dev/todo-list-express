var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {
        csslink: '../stylesheets/login.css',
        jslink: '/javascripts/login.js'
    });
});

router.post('enter', function(req, res, next) {
    console.log(req.body);
    res.redirect('/')
})


module.exports = router;