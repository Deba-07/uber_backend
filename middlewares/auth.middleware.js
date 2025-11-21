const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model")
const blackListedModel = require("../models/blacklistToken.model")
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    // Get token from cookies OR Authorization header
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const isBlackListed = await blackListedModel.findOne({ token: token})

    if(isBlackListed){
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lookup user
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  try {
    // Get token from cookies OR Authorization header
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const isBlackListed = await blackListedModel.findOne({ token: token})

    if(isBlackListed){
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lookup user
    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized: Captain not found" });
    }

    req.captain= captain;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};