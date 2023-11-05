const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectToMongoDb = () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        mongoose.connect(MONGO_URI);
        console.log("connected to mongodb");
    } catch (error) {
        console.log("error connecting to mongodb: " + error);
        process.exit();
    }
}

module.exports = connectToMongoDb;