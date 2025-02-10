import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided!" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }

      // Attach user data to req.user and ensure `id` matches with Note.js field `userId`
      req.user = { id: user._id, name: user.name };
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token has expired. Please login again.",
          });
      } else if (err.name === "JsonWebTokenError") {
        return res
          .status(403)
          .json({
            success: false,
            message: "Invalid token. Please login again.",
          });
      } else {
        throw err; // Unexpected error
      }
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Authentication failed. Please login again.",
      });
  }
};

export default authMiddleware;
