const { Schema, model } = require("mongoose")

const marketSchema = new Schema(
    {
        name: { type: String, required: true },
        imageUrl: {
            type: String,
            //default: '../assets/default-placeholder.png'
            default: 'https://www.sinrumbofijo.com/wp-content/uploads/2016/05/default-placeholder.png'
        },
        coordinates: {},
        address:{
            type:String, 
        },
        type: {
            type: String,
            enum: ["Farmers market", "Fresh Food market", "Flea market", "Street Food market", "Bazaar", "Night market", "Books market", "Fish market"]
        },
        description: String,
        openingMonths: [{
            type: String
    
        }],
        openingDays: [{
            type: String
        }],
        opening_hours: {
            from: String,
            to: String
        },
        website: String,
        stars: [{ type: Schema.Types.ObjectId, ref: "User" }], //!Stars es el numero de users que han marcado la actividad como favorita?
        author: { type: Schema.Types.ObjectId, ref: "User" }
    }
)

const Market = model("Market", marketSchema)

module.exports = Market