const jwt = require("jsonwebtoken");
const { ADMIN } = require("../constant/role");

function checkAuthentication(req, res, next) {
  let token = req.headers.authorization?.replaceAll("Bearer ", "");

  // console.log(req.headers.authorization)
  if (token) {
    try {
      const decodedUser = jwt.verify(token, "shhhhh");

      req.user = decodedUser;
      return next();
    } catch (error) {
      /* if there is error in jwt token from client...
           let leave it as it is and our below code will handle. */
    }
  }

  return res.status(401).send({
    msg: "unauthenticated",
  });
}

const isAdmin = (req, res, next) => {
  if (req.user.role === ADMIN) {
    return next();
  }
  res.status(403).json({
    msg: "Only for admin",
  });
};

module.exports = {
  checkAuthentication,
  isAdmin,
};
