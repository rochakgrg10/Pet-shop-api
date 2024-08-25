const express = require("express");
const Product = require("../models/productModel");
const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

const multer = require("multer");
const { checkAuthentication, isAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: "./uploads/", // Folder where images will be stored
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 5);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  checkAuthentication,
  isAdmin,
  upload.single("image"),
  createProduct
);
router.get("/", getAllProducts);
router.delete("/:_id", deleteProduct);
module.exports = router;
