const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ error: "user no longer exists" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: "invalid token provided" });
      console.log("invalid token access denied");
    }
  }
  if (!token) {
    return res.status(401).json({ error: "no token provided" });
    console.log("no token found");
  }
};

module.exports = { protect };
