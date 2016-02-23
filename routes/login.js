var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple')


router.get('/test', function(req,res){
  res.cookie('potato', "I AM A COOKIE")
  res.send("Hello there I am an example")
})
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
