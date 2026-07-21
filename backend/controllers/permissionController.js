import {
  getPermissions,
  getPermissionById,
} from "/services/permissionService.js";



/**
 * Get all permissions
 */
export const getAllPermissions = (
  req,
  res
) => {

  try {

    const permissions =
      getPermissions();


    return res
      .status(200)
      .json(
        permissions
      );


  } catch (error) {

    return res
      .status(500)
      .json({
        message:
          error.message,
      });

  }

};



/**
 * Get permission by ID
 */
export const getPermission = (
  req,
  res
) => {

  try {

    const permission =
      getPermissionById(
        req.params.id
      );


    return res
      .status(200)
      .json(
        permission
      );


  } catch (error) {

    if (
      error.message ===
      "Permission not found"
    ) {

      return res
        .status(404)
        .json({
          message:
            error.message,
        });

    }


    return res
      .status(500)
      .json({
        message:
          error.message,
      });

  }

};