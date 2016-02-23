var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple')


router.post('/', function(req, res){
  User.login(req.body, function(err, user){
    if(user){
      var token = jwt.encode(user, process.env.JWT_SECRET);
      console.log(token)
      res.cookie('token', token)
      res.send('login succesfull')
    } else{
      res.send('Incorrect Username or Password!')
    }
  })
})


module.exports = router;
