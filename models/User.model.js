const { Schema, model } = require("mongoose")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
	{
		name: {
			type: String,
			required:true,
			unique: true 
		},
		email: {
			type: String,
			required:true,
			unique: true 
		},
		password:{
			type: String,
			required:true
		},
		profilePicture: {
			type: String,
			default: '../assets/userLogo.png'
		},
		
		location: String,
		bookmarkList:[
			{
				type: Schema.Types.ObjectId,
				ref: "Market"
			},
		],
		usersFollowed: [
			{
				type: Schema.Types.ObjectId,
				ref:'User'

			},
		],
		typeOfCuisine:[{
			type: Object,
			enum:["Asian Food", "French",  "Mediterranean", "Lebanese", "Turkish", "Indian", "Mexican", "Caribbean", "German", "Rusian", "American", "Others"]
		}],
		dietaryReq:[{
			type: Object,
			enum:["Fast Food", "Vegetarian", "Vegan", "Low Carbs", "Healthy", "WholeFood", "Ecological", "Others"]
		}],
		eatingHabits:[{
			type:Object,
			enum:["Cooking", "EatIn", "Delivery", "StreetFood", "Others"]
		}],
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
	
)

const User = model("User", userSchema)

module.exports = User
