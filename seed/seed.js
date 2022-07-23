const Market = require("../models/Market.model");
const mongoose = require("mongoose");
require("../db");

const jsonData = require('./marketsData.json')
const dataSeed = async () => {
    try {
        await Market.deleteMany();
        const createMarkets = await Market.create(jsonData);
        console.log(`markets created:${createMarkets.length}`);
        await mongoose.connection.close();
    } catch (error) {
        console.log(error);
    }
}
dataSeed();