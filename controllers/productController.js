const Product = require("../models/productModel");
const path = require("path");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Validate inputs
    if (!name || !req.file || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      ...req.body,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const minRating = parseFloat(req.query.minRating);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    // Build the query object based on provided parameters
    let query = {};

    if (category) {
      query.category = { $in: [category] };
    }

    if (!isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }

    let products = await Product.find(query).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments({
      category: { $in: [category] },
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params._id);
    if (!product) {
      return res.status(404).json("Not found");
    }

    await Product.findOneAndUpdate({ _id: req.params._id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ product, msg: `${req.params._id} product updated` });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params._id);
    if (!product) {
      return res.status(404).json("Not found");
    }

    // Delete the image file from the upload folder
    const imagePath = product.image;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
    }

    await Product.deleteOne({ _id: req.params._id });
    res.send("Product deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};
