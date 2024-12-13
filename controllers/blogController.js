const Blog = require("../models/blogModel");
const fs = require("fs");
const path = require("path");
const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  console.log(blogs);
  res.status(200).send(blogs);
};

const createBlog = async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/blogs/${req.file.filename}`,
  });
  console.log(blog);
  res.status(201).send("blog craeted successfully");
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json("blog not found");
    }

    // Ensure the image file path is correct
    const imagePath = path.resolve(
      __dirname,
      "..",
      "uploads",
      "blogs",
      path.basename(blog.coverImageURL)
    );

    // Delete the image file from the upload folder
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
    }

    await Blog.deleteOne({ _id: id });
    res.status(200).send("Blog deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
};

const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params._id);
    if (!blog) {
      return res.status(404).json("Not found");
    }

    await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ blog, msg: `${req.params.id} blog updated` });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
};
