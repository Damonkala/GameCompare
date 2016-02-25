'use strict'

var express = require('express')
var router = express.Router();

var User = require('../models/User');

var jwt = require('jwt-simple');

router.post('/login', function(req, res){
  User.login(req.body, function(err, user){
    if(user){
      var token = jwt.encode(user, process.env.JWT_SECRET);
      res.send(token)
    } else{
      res.send('Incorrect Username or Password!')
    }
  })
})

router.post('/register', function(req, res){
  User.register(req.body, function(err, user){
    res.send(user)
  })
})

router.get('/list', function(req, res){
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users)
  })
})
router.get('/page/:username', function(req, res){
  User.findOne({'username' : req.params.username}).deepPopulate("reviews deathMatches deathMatches.game1 deathMatches.game2 reviews.deathMatch ").exec(function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  })
})
router.post('/erase', function(req, res){
  console.log("REQBAOCTYS:", req.body)
  User.remove({'_id' : req.body.userId}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }
    User.find({}, function(err, user){
      res.status(err ? 400 : 200).send(err || user)
    })
  })
})
router.put('/favorite', function(req, res){
  console.log(req.body);
  User.findByIdAndUpdate(req.body.myId, {$push: {favorites : req.body.favoriteId}}, function(err, user) {
    // res.status(err ? 400 : 200).send(err || user)
    if(err){
      res.status(400).send(err);
    }
    User.findById(user._id, function(err, updatedUser){
      // res.status(err ? 400 : 200).send(err || user)
      if(err){
        res.status(400).send(err);
      }
      updatedUser.password = null
      updatedUser.avatar = null;
      var newToken = jwt.encode(updatedUser, process.env.JWT_SECRET)
      console.log("NEWTOEKN", newToken)
      res.cookie("token", newToken)
      res.send(newToken)
    })
  })
})
router.post("/edit", function(req, res){
  console.log("edit api", req.body)
  User.findByIdAndUpdate(req.body._id, {$set: {
    address: req.body.address,
    phone: req.body.phone,
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  }
}, function(err, savedUser){
  console.log('user that got changed during the edit api function...savedUser', savedUser)
  User.findById(req.body._id, function(err, updatedUser){
    console.log("comes back from findbyId of svedUser",updatedUser);
    updatedUser.password = null;
    updatedUser.avatar = null
    if (!req.body.isAdmin){
      res.cookie("token", jwt.encode(updatedUser, process.env.JWT_SECRET));
    }
    res.send(updatedUser);
  })
})
})
router.put('/unfavorite', function(req, res){
  User.findByIdAndUpdate(req.body.myId, {$pull: {favorites : req.body.unFavoriteId}}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }
    User.findById(user._id).exec(function(err, updatedUser){
      if(err){
        res.status(400).send(err);
      }
      updatedUser.password = null;
      updatedUser.avatar = null;
      var token = updatedUser
      // token.favorites = null;
      var newToken = jwt.encode(token, process.env.JWT_SECRET)
      console.log("NEWTOEKN", newToken)

      User.findById(user._id).populate('favorites', 'avatar username').exec(function(err, responseUser){
        if(err){
          console.log('OH SHIT AN ERROR!', err)
          res.status(400).send(err);
        }
        responseUser.password = null;
        responseUser.avatar = null;
        console.log("USER RESPONSE BITCH!",responseUser)
        // res.cookie("token", newToken)
        res.send(responseUser)
        // res.send(updatedUser)
      })
    })
  })
})


module.exports = router;
