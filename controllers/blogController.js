const Blog = require("../models/Blog");

const mongoose = require("mongoose");
const isAuthenticated = require("../middlewares/isAuthenticated");
const blogValidation = require("../utils/blogValidation");
const fs = require("fs");
const createBlog = [
    isAuthenticated,blogValidation,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;
        const { title, content } = req.body;
        console.log("blogImage",req.file);
        try {
            const newBlog = await Blog.create({
                user: userId,
                title,
                content,
                ...(req.file ? { blogImage: req.file.path.replace(/\\/g, "/") } : {}),
            });

            res.status(201).json({
                status: "success",
                message: "Blog created successfully",
                newBlog,
                blogUrl: `${process.env.BASE_URL}api/blogs/${newBlog.id}/${newBlog.user}`,
                blogImageUrl: `${process.env.BASE_URL}${newBlog.blogImage}`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const getAllBlogsOfLoggedInUser = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }

        try {
            const blogs = await Blog.find({ user: userId }).populate('user', 'username pic');
            if (blogs.length === 0) {
                return res.status(200).json({
                    status: "success",
                    message:
                        "you have not created any blogs you can create blogs by using below url",
                    createBlogUrl: `${process.env.BASE_URL}api/blog/create`,
                });
            }
            const blogsWithAuthor = blogs.map(blog => ({
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                blogImage: `${process.env.BASE_URL}${blog.blogImage}`,
                createdAt: blog.createdAt,
                user: {
                    _id: blog.user._id,
                    username: blog.user.username,
                    pic: `${process.env.BASE_URL}${blog.user.pic}`
                },
            }));
            return res.status(200).json({
                status: "success",
                message: "blogs fetched successfully",
                blogs: blogsWithAuthor,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const getBlogById = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        const blogId = req.params.id;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid ID format" });
        }
        try {
            const blog = await Blog.findOne({ user: userId, _id: blogId }).populate('user', 'username pic');
            const user = {
                _id: blog.user._id,
                username: blog.user.username,
                pic: `${process.env.BASE_URL}${blog.user.pic}`
            }
            if (!blog) {
                return res
                    .status(404)
                    .json({ status: "error", message: "Blog not found" });
            }
            return res.status(200).json({
                status: "success",
                message: "blog details fetched successfully",
                blog,
                blogImageUrl: `${process.env.BASE_URL}${blog.blogImage}`,
                user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const editBlog = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        const blogId = req.params.id;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid ID format" });
        }

        try {
            const updates = req.body;

            if (req.file) {

                const existingBlog = await Blog.findOne({ user: userId, _id: blogId });


                const imagePath = existingBlog.blogImage.replace(/\//g, "\\");
                fs.unlinkSync(imagePath);



                updates.blogImage = req.file.path.replace(/\\/g, "/");
            }

            const blog = await Blog.findOneAndUpdate(
                { user: userId, _id: blogId },
                updates,
                { new: true }
            );
            return res
                .status(200)
                .json({
                    status: "success",
                    message: "blog updated successfully",
                    blog,
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const deleteBlogById = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        const blogId = req.params.id;
        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid ID format" });
        }

        try {
            const blog = await Blog.findOneAndDelete({ user: userId, _id: blogId });
            return res
                .status(200)
                .json({ status: "success", message: "blog deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const deleteAllBlogs = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }

        try {
            const blog = await Blog.deleteMany({ user: userId });
            return res
                .status(200)
                .json({ status: "success", message: "all blogs deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];


const getAllBlogs = [
    isAuthenticated,
    async (req, res) => {
        // const { userId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ status: "error", message: "no userid provided" });
        }

        try {
            const blogs = await Blog.find({}).populate('user', 'username pic');
            if (blogs.length === 0) {
                return res.status(200).json({
                    status: "success",
                    message: "no blogs found"
                });
            }
            const blogsWithAuthor = blogs.map(blog => ({
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                blogImage: `${process.env.BASE_URL}${blog.blogImage}`,
                createdAt: blog.createdAt,
                user: {
                    _id: blog.user._id,
                    username: blog.user.username,
                    pic: `${process.env.BASE_URL}${blog.user.pic}`
                },
            }));
            return res.status(200).json({
                status: "success",
                message: "blogs fetched successfully",
                blogs: blogsWithAuthor,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: error.message });
        }
    },
];

const searchBlogs = [
    isAuthenticated,
    async (req, res) => {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(200).json({ error: 'query is required' });
            }

            const blogs = await Blog.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                ],
            }).populate('user', 'username pic');


            const blogsWithAuthor = blogs.map(blog => ({
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                blogImage: `${process.env.BASE_URL}${blog.blogImage}`,
                createdAt: blog.createdAt,
                user: {
                    _id: blog.user._id,
                    username: blog.user.username,
                    pic: `${process.env.BASE_URL}${blog.user.pic}`
                },
            }));

            res.status(200).json({ status: "success", message: "your search results..", searchResults: blogsWithAuthor });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }];


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    editBlog,
    deleteBlogById,
    deleteAllBlogs,
    searchBlogs,
    getAllBlogsOfLoggedInUser
};
