'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var app = express();
var cookieParser = require("cookie-parser");

var request = require('request');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/gameCompare');

app.set('views', 'templates');
app.set('view engine', 'ejs');

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser())

// ROUTES
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/games', require('./routes/games'))
app.use('/user', require('./routes/user'))
app.use('/auth', require('./routes/auth'))
app.use('/imageUpload', require('./routes/imageUpload'))


app.use('/', function(req, res){
	res.render('index')
});


// 404 HANDLER
app.use(function(req, res){
  res.status(404).render('404')
})

app.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});
