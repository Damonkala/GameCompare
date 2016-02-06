'use strict';

var User = require('../models/User');

var jwt = require('jwt-simple');

module.exports = function(req, res, next){
  if (req.body.token){
    var token = req.body.token
    var decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    var userId = decodedToken._id;
    User.findById(userId, function(err, user){
      if(err || !user) return res.send(err || 'Authentication required.');
      next();
    });
  } else {return res.send('authRequired')}
};
