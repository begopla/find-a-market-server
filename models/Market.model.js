const { Schema, model } = require("mongoose")

const marketSchema = new Schema(
    {
        name: { type: String, required: true },
        imageUrl: String,
        address: {
            coordinates: [Number]
        },
        type: {
            type: String,
            enum: ["Farmers market", "Fresh Food market", "Flea market", "Street Food market", "Bazaar", "Night market", "Books market"]
        },
        Description: String,
        opening_days: [{
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Every day"]
        }],
        opening_months: [{
            type: String,
            enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "All year"]
        }],
        opening_hours: {
            from: {
                type: Number,
                max: 23
            },
            to: {
                type: Number,
                max: 23
            }
        },
        website: String,
        stars: [{ type: Schema.Types.ObjectId, ref: "User" }], //!Stars es el numero de users que han marcado la actividad como favorita?
        author: { type: Schema.Types.ObjectId, ref: "User" }
    }
)

const Market = model("Market", marketSchema)

module.exports = Market