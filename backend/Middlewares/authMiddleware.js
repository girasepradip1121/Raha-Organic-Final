const jwt = require("jsonwebtoken");
// const models = require("../Models/index");
const User = require("../Models/usermodel");
require("dotenv").config();

const authMiddleWare = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return Error(res, "Token is missing, please provide a valid token");
  }

  try {
    const decodedToken = jwt.decode(token);

    if (decodedToken === null) {
      return res.status(403).json({
        status: 403,
        description: "Token does not match",
      });
    }
    console.log("decoded", decodedToken);

    const user = await User.findOne({
      where: { userId: decodedToken.id },
    });
    console.log("user", user);

    if (!user) {
      return res
        .status(403)
        .json({ status: 403, description: "User not found" });
    }

    if (user.token !== token) {
      return res.status(403).json({
        status: 403,
        description: "Token does not match!!!",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verifiedUser) => {
      if (err) {
        return res
          .status(403)
          .json({ status: 403, description: "Token is invalid or expired" });
      }

      req.user = verifiedUser;
      next();
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, description: "Internal Server Error" });
  }
};

module.exports = authMiddleWare;
