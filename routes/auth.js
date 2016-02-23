var express = require('express')
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res){
  // User.isAuthenticated()
  res.send('hOi')
})

// router.post('/', isAuthorized ,function(req, res){
//   console.log('is logged in')
//   console.log(req.body.token)
//   res.send('is logged in')
// })

module.exports = router;
