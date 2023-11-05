const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid user ObjectId",
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required:true
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog",blogSchema);

module.exports = Blog;