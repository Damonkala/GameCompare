'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var userSchema = Schema({
	email:{type: String, required: true, unique: true},
	username: { type: String, required: true, unique: true},
	name: {type: String, required: true},
	password: { type: String, required: true },
	avatar: {type: String, data:Buffer, default: ''},
	deathMatches: [{type: Schema.Types.ObjectId, ref: "DeathMatch"}],
	reviews: [{type: Schema.Types.ObjectId, ref: "UserReview"}],
	joinDate: { type : Date, default: Date.now },
	score: { type: Number, default: 0},
	votes: {type: Array, default: []}
});

userSchema.plugin(deepPopulate);

userSchema.statics.register = function(user, cb){
	var username = user.username;
	var email = user.email;
	var name = user.name;
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, password) {
			User.find({$or: [{username: username}, {email: email}] }, function(err, user){
				if (err || user[0]){return console.log(err) || console.log("Username or email already exists")}
				var newUser = new User;
				newUser.username = username;
				newUser.email = email;
				newUser.name = name;
				newUser.password = password;
				console.log(newUser)
				newUser.save(function(err, savedUser){
					savedUser.password = null;
					cb(err, savedUser)
				})
			})

		});
	});


}


userSchema.statics.login = function(user, cb){
	var username = user.username;
	var password = user.password;
	User.findOne({username: username}, function(err, dbUser){
		if(err || !dbUser) return cb(err || 'Incorrect username or password');
		bcrypt.compare(user.password, dbUser.password, function(err, correct){
			if(err || !correct) return cb(err || 'Incorrect username or password');
			dbUser.password = null;
			dbUser.avatar = null
			cb(null, dbUser);
		})
	})
}

User = mongoose.model('User', userSchema);


module.exports = User;
