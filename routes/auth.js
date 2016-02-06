var express = require('express')
var router = express.Router();
var isAuthorized = require('../config/auth')
router.get('/', function(req, res){
  console.log()
})

router.post('/', isAuthorized ,function(req, res){
  console.log('is logged in')
  console.log(req.body.token)
  res.send('is logged in')
})

module.exports = router;
