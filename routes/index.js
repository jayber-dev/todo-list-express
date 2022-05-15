var express = require('express');
var coockie = require('cookie-parser')
const fs = require('fs');
const { send } = require('process');
const app = require('../app');
const data = require("../data.json")
const jsonEditor = require('edit-json-file')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Express', toList: data });
});

// -------------------- POST METHOD HANDLER -----------------------
router.post('/handle', (req, res, next) => {
    let bodyData = req.body;
    console.log('im in the post method')

    let toRemove = Number(bodyData.itemId)
    data.splice(toRemove, 1)

    console.log(data)
    res.render('index', { title: 'Express', toList: data });
})


module.exports = router;