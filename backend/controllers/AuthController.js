import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/AuthService.js";

/**
 * Login Controller
 */
export const login = async (req, res) => {

  try {

    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * Logout Controller
 */
export const logout = async (req, res) => {

  try {

    const result = await logoutUser();

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * Current User Controller
 */
export const currentUser = async (req, res) => {

  try {

    const user = await getCurrentUser();

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }

};