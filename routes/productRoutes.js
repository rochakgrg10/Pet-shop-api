const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(products);
});

router.post("/", async (req, res) => {
  const { name, price } = req.body;
  await Product.create({
    name: name,
    price: price,
  });
  return res.status(201).json("Product created successfully");
});

module.exports = router;
