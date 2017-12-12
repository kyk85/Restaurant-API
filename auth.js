var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./user.js')

exports.isAuthenticated = passport.authenticate('basic', {
	session:false
});

passport.use(new BasicStrategy(
	function(username,password,callback){
		User.findOne({username:username},function(err,user){
			if (err) {return callback(err);}

			//No user found with that username
			if(!user) {return callback(null,false);}

			//Make sure the password is correct
			user.verifyPassword(password,function(err,isMatch){
				if (err) {return callback(err);}
				if (!isMatch) {return callback(null,false);}
				return callback(null,user);

			});
		});
	}));