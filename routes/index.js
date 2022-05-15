var express = require('express');
var coockie = require('cookie-parser')
const fs = require('fs');
const { send } = require('process');
const app = require('../app');
const data = require("../data.json")
const jsonEditor = require('edit-json-file');
const { json } = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(fs)
    fs.readFile("data.json", 'utf-8', (err, data) => {
        if (err) {
            console.log('an error reading file')
        }
        console.log(data)
    })
    res.render('index', { title: 'Express', toList: data });
});

// -------------------- POST METHOD HANDLER -----------------------
router.post('/handle', (req, res, next) => {
<<<<<<< HEAD

    console.log(req.body)
=======
    let bodyData = req.body;
>>>>>>> cb4e056581a7c49912c1a31ef7468a432c0c04af
    console.log('im in the post method')
    let toRemove = Number(bodyData.itemId)
    data.splice(toRemove, 1)
    fs.writeFile("data.json", JSON.stringify(data, indent = 4), (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('wrote new data')
    })
    res.render('index', { title: 'Express', toList: data });
})


module.exports = router;