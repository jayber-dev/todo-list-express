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

router.post('/', (req, res, next) => {

})


module.exports = router;