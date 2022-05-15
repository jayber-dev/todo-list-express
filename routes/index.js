var express = require('express');
var coockie = require('cookie-parser')
const fs = require('fs');
const { send } = require('process');
const app = require('../app');
const data = require("../data.json")
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
    res.render('index', { title: 'TO_DO LIST', toList: data });
});

// -------------------- POST METHOD DELETE LIST ITEM HANDLER -----------------------
router.post('/handle', (req, res, next) => {
    let bodyData = req.body;
    console.log('im in the post method')
    let toRemove = Number(bodyData.itemId)
    console.log(toRemove)
    console.log(typeof toRemove)
    console.log(`toremove: ${toRemove}`)
    data.splice(toRemove, 1)
    for (let i = 0; i < data.length; i++) {
        data[i].id = i
    }
    fs.writeFile("data.json", JSON.stringify(data, indent = 4), (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('wrote new data')
    })
    console.log(data)
    res.render('index', { title: 'Express', toList: data });
})

// ------------------- POST METHOD FOR ADDING ITEMS TO LIST HANDLER ----------------
router.post('/addItem', (req, res, next) => {
    let itemId
    console.log("im inside the additem")
        // console.log(req.body)
    if (data.length == 0) {
        itemId = 0
    } else {
        itemId = data.length
    }
    let dataToAppend = {
        "id": itemId,
        "todo": req.body.content
    }
    data.push(dataToAppend);
    fs.writeFile("data.json", JSON.stringify(data, indent = 4), (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('data updated')

    })
    res.render('index', { title: 'Express', toList: data });
})


module.exports = router;