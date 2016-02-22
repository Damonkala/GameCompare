'use strict'

var express = require('express')
var router = express.Router();
var User = require('../models/User.js');

router.post('/', function(req, res){
  console.log("WE ARE CURRENTLY REGISTERING A USER!!!!!!!");
  User.register(req.body, function(err, user){
  console.log("WE HAVE REGISTERED A NEW USER!", user);
    res.send(user)
  })
})


module.exports = router;
