import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
export const protectRoute = async (req, res, next) => {
  try {
    // check if token exist
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unathorized - No token provieded" });
    // check if token valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unathorized - Invalid Token" });

    // check if user exist
    const user = await User.findById(decoded.userId).select("-password"); // select everything but password
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;// add user to request

    next();
  } catch (error) {
    console.log("Error in protrctRoute middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
