import {
  isAuthenticated,
  getCurrentUser,
} from "../services/AuthService.js";

/**
 * Authentication Middleware
 */
export const authenticate = async (
  req,
  res,
  next
) => {

  try {

    if (!isAuthenticated()) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });

    }

    req.user = await getCurrentUser();

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }

};