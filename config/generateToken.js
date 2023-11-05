const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (userId) => {
       
    try { 
        const token = await jwt.sign({userId:userId}, JWT_SECRET,{expiresIn:"7d"});
        return token;
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error',message: error.message});
    }
}

module.exports = generateToken;