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
  const products = await Product.find({});
  return res.status(200).json(products);
};

const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params._id);
    if (!product) {
      res.status(404).json("Not found");
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

module.exports = { createProduct, getAllProducts, deleteProduct };
