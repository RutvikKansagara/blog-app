const blogValidation = async (req,res,next) => {
     const {title,content} = req.body;
    // Check if title and content are provided
  if (!title || !content ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  

  // Validate title length
  if (title.length < 8 || title.length > 200) {
    return res.status(400).json({
      status: "error",
      message: "title must be between 8 and 200 characters",
    });
  }
  next();
}

module.exports = blogValidation;
