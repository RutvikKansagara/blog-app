const express = require("express");

const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  editBlog,
  deleteBlogById,
  deleteAllBlogs,
  searchBlogs,
  getAllBlogsOfLoggedInUser
} = require("../controllers/blogController");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },

  fileFilter: fileFilter,
});

router.post("/blog/create/:userId", upload.single("blogImage"), createBlog);
router.get("/user-blogs/:userId", getAllBlogsOfLoggedInUser);
router.get("/blogs/:id/:userId", getBlogById);
router.put("/blog/edit/:id/:userId", upload.single("blogImage"),editBlog);
router.delete("/blog/delete/:id/:userId", deleteBlogById);
router.delete("/delete-all-blogs/:userId", deleteAllBlogs);
router.get("/:userId/search",searchBlogs);
router.get("/all-blogs/:userId", getAllBlogs);
module.exports = router;
