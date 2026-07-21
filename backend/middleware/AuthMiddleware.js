import {
  getCurrentUser,
  isAuthenticated,
} from "../services/AuthService.js";


export const authenticate = (
  req,
  res,
  next
) => {


  if (!isAuthenticated()) {


    return res.status(401).json({

      success:false,

      message:
        "Unauthorized."

    });


  }


  next();

};

export const authenticateWithUser = async (
  req,
  res,
  next
) => {
  try {
    req.user = await getCurrentUser();
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};
