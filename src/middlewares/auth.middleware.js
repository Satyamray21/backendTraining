import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify the JWT
export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // Handle mobile token

    if (!token) {
      // If no token is provided
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user using the decoded token's user ID
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      // If user is not found in the database
      throw new ApiError(401, "Invalid user");
    }

    // Attach user info to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any error that occurs during token verification
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
