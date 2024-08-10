const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8001;

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  return res.send("Hello world");
});

app.listen(PORT, () => {
  mongoose
    .connect(
      "mongodb+srv://rochakgrg:DqmOf4GjvyidX4Jh@pet-shop.1nrzr.mongodb.net/petShopDB?retryWrites=true&w=majority&appName=Pet-shop"
    )
    .then(() => console.log("Mongodb connected successfully"))
    .catch((err) => console.log("Mongodb error ", err));
  console.log(`app is listening on port ${PORT}`);
});
