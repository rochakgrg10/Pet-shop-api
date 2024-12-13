const express = require("express");
const router = express.Router();
const Blog = require("../models/blogModel");

const multer = require("multer");
const { checkAuthentication, isAdmin } = require("../middleware/auth");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");

const storage = multer.diskStorage({
  destination: "./uploads/blogs/", // Folder where images will be stored
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 5);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllBlogs);
router.post(
  "/",
  checkAuthentication,
  isAdmin,
  upload.single("coverImageURL"),
  createBlog
);
router.delete("/:id", checkAuthentication, isAdmin, deleteBlog);
router.patch("/:id", checkAuthentication, isAdmin, updateBlog);

module.exports = router;
