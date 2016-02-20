var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple')


router.post('/', function(req, res){
  console.log("Made it to the route");
  console.log("3: IS THERE A USER", req.body);
  User.login(req.body, function(err, user){
    if(user){
      console.log("4: IS THERE A USER", user);
      var token = jwt.encode(user, process.env.JWT_SECRET);

      console.log(token)
      res.cookie('token', token).send('login succesfull')
    } else{
      res.send('Incorrect Username or Password!')
    }
  })
})


module.exports = router;
