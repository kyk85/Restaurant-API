var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var HoursSchema=new Schema ({ //child 1
	days: String,
	hours: String
})

var ReviewSchema=new Schema ({ //child 2
	rating: {type: Number, min:1, max:5, default:1},
	user: String,
	comment: String
})

var RestaurantSchema=new Schema ({  //parent
	opening: [HoursSchema],
	reviews: [ReviewSchema],
	name: String,
	address: String,
	added: {type:Date,default:Date.now}
})

module.exports=mongoose.model('Restaurant',RestaurantSchema)