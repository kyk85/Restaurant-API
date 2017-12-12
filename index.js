var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://kyk:qwerty654321@ds115546.mlab.com:15546/wk3_api_exercise')

var Restaurant = require('./schema.js');
var User = require('./user.js');

var passport = require('passport');
var authController = require('./auth.js');

app.use(passport.initialize());

//configuration on the express server
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//the default port is 8080 unless specified otherwise
var port = process.env.PORT || 8080; //set the port

//create the route
var router=express.Router();

//prefix for the route
app.use(router);

//listen for an event on port specified
app.listen(port);
console.log('Server started at ' + port);

router.get('/',function(req,res,next){
	res.json({message:"this works!"})
});

router.route('/restaurants').get(function(req,res,next){
	Restaurant.find(function(err,restaurants){
		if (err){
			res.send(err);
		} else {
			res.json(restaurants);
		}
	})
})

router.route('/create').post(authController.isAuthenticated,function(req,res,next){
	var rest = new Restaurant({
		opening: [{days: req.body.days, hours: req.body.hours}],
		reviews: [{rating:req.body.rating, user:req.body.user, comment:req.body.comment}]
	}) ;
	rest.name = req.body.name;
	rest.address = req.body.address;
	rest.save(function(err){
		if (err) {
			res.send(err);
		} else {
			res.json(req.body.name + " has been added!");
		}
	})
});


/*router.route('/login').post(function(req,res,next){
	User.findOne({'username':req.body.username}, function(err,user){
		if (err) {
			return res.send (err)
		} else {
			if(req.body.password==user.password) {
				return res.json({message:"ok"})
			} else {
				return res.json({message:"password wrong"})
			}
		}
	})
})*/

router.route('/register').post(function(req,res,next){
	var user = new User()
	user.username = req.body.username;
	user.password = req.body.password;

	user.save (function(err){
		if (err) {
			res.send(err)
		} else {
			res.json({message:"User has been created!"})
		}
	})
})



router.route('/restaurants/:id/reviews/:reviews_id').post(function(req,res,next){
	//var rest=mongoose.model('Restaurant')

var newReview = {
'rating':req.body.rating,
'comment':req.body.comment,
'user:':req.body.user,
'id': req.params.reviews_id 
}
	Restaurant.findOneAndUpdate(
		{"_id":req.params.id, "reviews._id":req.params.reviews_id},
		{
			"$set":
			 {'reviews' : newReview	}
},
		function(err,rest) {
			if (err) {
				res.send(err)
			} else {
				res.json("success")
			}
		}
		)


})