const mongoose = require("mongoose");
const { BUYER, ADMIN } = require("../constant/role");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [BUYER, ADMIN],
      required: true,
      set: (value) => {
        return value.toLowerCase();
      },
      default: "BUYER",
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("user", userSchema);
module.exports = User;
