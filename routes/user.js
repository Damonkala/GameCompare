'use strict'

var express = require('express')
var router = express.Router();
var User = require('../models/User');
var jwt = require('jwt-simple');
var request = require('request');

router.post('/register', function(req, res){
  User.register(req.body, function(err, user){
    res.send(user)
  })
})
router.post('/login', function(req, res){
  User.authenticate(req.body, function(err, user){
    if(user){
      var token = user.token()
      request.post('/auth', function(error, response, token)
      {

      })
      // var token = jwt.encode(user, process.env.JWT_SECRET);
      console.log(token)
      // res.send('login succesfull')
    } else{
      res.send('Incorrect Username or Password!')
    }
  })
})

router.get('/list', function(req, res){
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users)
  })
})
router.get('/page/:username', function(req, res){
  User.findOne({'username' : req.params.username}, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('favorites')
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

  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      console.log('google profile:', profile);
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, process.env.JWT_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = user.createJWT();
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: existingUser.createJWT() });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.save(function(err) {
            var token = user.createJWT();
            res.send({ token: token });
          });
        });
      }
    });
  });
});











module.exports = router;
