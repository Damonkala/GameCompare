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
	joinDate: { type : Date, default: Date.now }
});

userSchema.plugin(deepPopulate);

userSchema.statics.register = function(user, cb){
	console.log("THIS IS THE NEW USER WE'RE REGISTERING", user);
	var username = user.username;
	var email = user.email;
	var name = user.name;
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, password) {
			User.find({$or: [{username: username}, {email: email}] }, function(err, user){
				if (err || user[0]){return console.log(err) || console.log("Username or email already exists")}
				console.log("HEY! WE GOTA  NEW USER!!!!!!!", user);
				var newUser = new User;
				newUser.username = username;
				newUser.email = email;
				newUser.name = name;
				newUser.password = password;
				console.log(newUser)
				newUser.save(function(err, savedUser){
					console.log('saved user: ', savedUser)
					console.log(err);
					console.log("HEY! WE SAVED A NEW USER INTO THE DATABASE YO!!!!!!!", savedUser);
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
	// User.find({$or: [{username: username}, {email: username}]}, function(err, userReturned){
	// 	console.log(userReturned.length)
	// 	if(userReturned.length){
	// 		bcrypt.compare(password, userReturned[0].password, function(err, res){
	// 			userReturned[0].password = null
	// 			cb(null, userReturned[0])
	// 		})
	//
	// 	}else{cb('no user found', null)}
	// 	if(err){return console.log(err)}
	// 	})
}

User = mongoose.model('User', userSchema);


module.exports = User;
