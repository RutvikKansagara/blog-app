// const mongoose = require("mongoose");
// const dotenv = require("dotenv").config();

// const connectToMongoDb = () => {
//     try {
//         const MONGO_URI = process.env.MONGO_URI;

//         mongoose.connect(MONGO_URI);
//         console.log("connected to mongodb");
//     } catch (error) {
//         console.log("error connecting to mongodb: " + error);
//         process.exit();
//     }
// }

// module.exports = connectToMongoDb;

const mongoose = require("mongoose");

const dotenv = require("dotenv").config();

const connectToMongoDb = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
        });

        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); // Exit with a non-zero status code to indicate failure
    }
};

module.exports = connectToMongoDb;
