var express = require('express');
var coockie = require('cookie-parser')
const fs = require('fs');
const { send } = require('process');
const app = require('../app');
const data = require("../data.json")
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Express', toList: data });
});

router.post('/handle', (req, res, next) => {

    console.log(req.body)
    console.log('im in the post method')
    res.render('index', { title: 'Express', toList: data });
})


module.exports = router;