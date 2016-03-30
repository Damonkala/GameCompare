var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple');
router.post('/', function(req, res){
  User.findByIdAndUpdate(req.body.userId, {$set : {avatar: req.body.image.base64}}, function(err, user){
    User.findById(req.body.userId, function(err, updatedUser){
      updatedUser.password = null;
      var userToken = jwt.encode(updatedUser, process.env.JWT_SECRET)
      res.cookie("token", userToken);
      res.send(updatedUser)
    })
  })

})


module.exports = router;
