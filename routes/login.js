var express = require('express');
const app = require('../app');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db')



module.exports = router;