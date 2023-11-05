const User = require("../models/User");
const fs = require("fs");
const hashPassword = require("../config/hashPassword");
const decryptPassword = require("../config/decryptPassword");
const generateToken = require("../config/generateToken");
const isAuthenticated = require("../middlewares/isAuthenticated");
const registerValidation = require("../utils/registerValidation");
const loginValidation = require("../utils/loginValidation");





const register =
    [registerValidation,async (req, res) => {

        

        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: "please fill all the fields" });
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return res
                .status(200)
                .json({ message: "use unique email. user found with this email" });
        }
        try {
            const hashedPassword = await hashPassword(password);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                ...(req.file ? { pic: req.file.path.replace(/\\/g, "/") } : {}),
            });

            res.status(201).json({
                status: "success",
                message: "User created successfully",
                user: newUser,
                imageUrl: `${process.env.BASE_URL}${newUser.pic}`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    }]


const login =
    [loginValidation,async (req, res) => {

        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "no user found with this credentials",

            });
        }

        try {
            const hashedPasswordFromDatabase = user.password;
            const isPasswordSame = await decryptPassword(
                password,
                hashedPasswordFromDatabase
            );
            console.log(isPasswordSame);
            if (isPasswordSame) {
                req.userId = user._id;
                console.log("req user:", req.userId);
                console.log(req);
                const token = await generateToken(user._id);
                console.log(user);
                return res.status(200).json({
                    status: "success",
                    message: "login successful",
                    token: token,
                    user: user
                });
            } else {
                return res
                    .status(400)
                    .json({ status: "error", message: "invalid credentials" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },]

const deleteUser = [
    isAuthenticated,
    async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }
        try {
            const existingUser = await User.findOne({ _id: userId });




            const imagePath = existingUser.pic.replace(/\//g, "\\");
            fs.unlinkSync(imagePath);

            const user = await User.findByIdAndDelete({ _id: userId });
            if (!userId) {
                return res
                    .status(401)
                    .json({ status: "error", message: "no userid provided" });
            }
            res
                .status(200)
                .json({ status: "success", message: "user deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const getUserDetails = [
    isAuthenticated,
    async (req, res) => {
        console.log(req.userId);
        const { userId } = req.params;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }

        try {
            const user = await User.findOne({ _id: userId });
            if (!user) {
                res
                    .status(404)
                    .json({ status: "not found", message: "user not found" });
            }
            res.status(200).json({
                status: "success",
                message: "successfully fetched details",
                user_details: user,
                userImageUrl:`${process.env.BASE_URL}${user.pic}`
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const updateUserDetails = [
    isAuthenticated,
    async (req, res) => {

        const { userId } = req.params;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }
        try {
            const updates = req.body;

            if (req.file) {
                const existingUser = await User.findOne({ _id: userId });
                const imagePath = existingUser.pic.replace(/\//g, "\\");
                fs.unlinkSync(imagePath);
            }

            updates.pic = req.file.path.replace(/\\/g, "/");

            // If the updates include a new password, hash it
            if (updates.password) {
                const hashedPassword = await hashPassword(updates.password);
                updates.password = hashedPassword;
            }
            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            res
                .status(200)
                .json({ status: "success", message: "user updated successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }

    },
];

 

// Logout route
const logout = [isAuthenticated,async (req, res) => {
    
    res.setHeader('Authorization', '');
  
    
  
    res.json({ message: 'Logout successful' });
  }];
  




module.exports = {
    register,
    login,
    deleteUser,
    getUserDetails,
    updateUserDetails,
    logout
};

