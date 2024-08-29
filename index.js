const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 8001;

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  return res.send("Hello world");
});

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Mongodb connected successfully"))
    .catch((err) => console.log("Mongodb error ", err));
  console.log(`app is listening on port ${PORT}`);
});
