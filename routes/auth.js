var express = require('express')
var router = express.Router();
var isAuthorized = require('../config/auth')


router.post('/', isAuthorized ,function(req, res){
  res.send('is logged in')
})

module.exports = router;
