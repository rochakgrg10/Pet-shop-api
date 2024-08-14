const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

/* 
    1. Client side validation
    2. Server side validation
    3. database side validation
*/

const signupValidationSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(5)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  role: Joi.string().valid("buyer", "admin").required(),
});

const signup = async (req, res, next) => {
  try {
    await signupValidationSchema.validateAsync(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "validation error",
      errors: err.details.map((el) => {
        return {
          field: el.context.key,
          msg: el.message,
        };
      }),
    });
  }

  try {
    // const {name, email, phone, password} = req.body;
    // let hash = await bcrypt.hash(password, 10);
    // const user = await User.create({ name, email, phone, password: hash });
    /* spread operator */
    let hashed = await bcrypt.hash(req.body.password, 10);
    let user = await User.create({ ...req.body, password: hashed });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/* 
    stateful - session/cookie
    stateless - json
*/

const login = async (req, res, next) => {
  /* server side validation for login */
  let email = req.body.email;
  let password = req.body.password;
  let user = await User.findOne({ email }); //null
  if (!user) {
    return res.status(401).send("Invalid email");
  }
  let matched = await bcrypt.compare(password, user.password);
  if (matched) {
    user = user.toObject();
    user.password = undefined;
    let token = jwt.sign(user, "shhhhh", { expiresIn: "7d" });

    return res.status(201).send({ token });
  }

  return res.status(401).send({
    msg: "Invalid credentials",
  });
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  signup,
  login,
  fetchUsers,
};
