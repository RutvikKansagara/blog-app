const registerValidation = (req, res, next) => {
  const { username, email, password, confirmpassword } = req.body;

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  // Validate password length
  if (password.length < 8 || password.length > 10) {
    return res.status(400).json({
      status: "error",
      message: "Password must be between 8 and 10 characters",
    });
  }

  if (password !== confirmpassword) {

    return res.status(400).json({
      status: "error",
      message: "password mismatch"
    })
  }
  next();
}

module.exports = registerValidation;