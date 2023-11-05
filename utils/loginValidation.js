const loginValidation = async (req,res,next) =>{
     const {email,password} = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password are required.",
        });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format.",
        });
      }
  
      // Validate password length
      if (password.length < 8 || password.length > 10) {
        return res.status(400).json({
          status: "error",
          message: "Password must be between 8 and 10 characters.",
        });
      }
      next();
}

module.exports = loginValidation;