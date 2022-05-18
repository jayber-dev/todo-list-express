var express = require('express');
var coockie = require('cookie-parser')
const fs = require('fs');
const { send } = require('process');
const app = require('../app');
// const data = require("../data.json")
const { json } = require('express');
var router = express.Router();
const data = require("../data.json")

// TODO: fix to many event treggers
// TODO: build SQL database

let dataFile
    /* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile("data.json", 'utf-8', (err, dataFile) => {
        if (err) {
            console.log('an error reading file')
        }
        console.log('file been read')
        console.log(JSON.parse(dataFile))

    })

    res.render('index', { title: "Manage your task's", toList: data });
});

// --------------------- POST FOR PRIORITY CHANGE ----------------------------
router.post("/priority", (req, res, next) => {
    console.log('in the priority');
    data[req.body.id].priority = req.body.priority
        // console.log(`current data\n ${data[req.body.id].priority}`);
    fs.writeFile("data.json", JSON.stringify(data, 4), (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('data updated')

    })
    console.log(data);
    res.render('index', { title: "Manage your task's", toList: data });
})

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
    if (data.length == 0) {
        itemId = 0
    } else {
        itemId = data.length
    }
    console.log(req.body)
    let dataToAppend = {
        "id": itemId,
        "priority": req.body.priority,
        "todo": req.body.content
    }
    data.push(dataToAppend);
    console.log(data)
    fs.writeFile("data.json", JSON.stringify(data, indent = 4), (err) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('data updated')

    })

})




module.exports = router;