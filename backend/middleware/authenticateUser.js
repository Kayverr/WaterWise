export const authenticateUser = (
  req,
  res,
  next
) => {

  try {

    const user = {
      id:
        "user-001",

      username:
        "admin",

      roleId:
        "role-001",
    };


    if (!user) {

      return res
        .status(401)
        .json({
          message:
            "Unauthorized",
        });

    }


    req.user =
      user;


    next();


  } catch (error) {

    return res
      .status(500)
      .json({
        message:
          "Authentication failed",
      });

  }

};