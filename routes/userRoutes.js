const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json(users);
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body;
    await User.create({
      username,
      email,
      password,
    });
    return res.status(201).json("User created successfully");
  });

module.exports = router;
