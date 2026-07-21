import {
  getRoles,
  getRoleById,
  createRole,
  editRole,
  deleteRole,
  updateRolePermissions,
  getRolePermissions,
} from "/services/roleService.js";



/**
 * Get all roles
 */
export const getAllRoles = (
  req,
  res
) => {

  try {

    const roles =
      getRoles();


    return res
      .status(200)
      .json(
        roles
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
 * Get role by ID
 */
export const getRole = (
  req,
  res
) => {

  try {

    const role =
      getRoleById(
        req.params.id
      );


    return res
      .status(200)
      .json(
        role
      );


  } catch (error) {

    if (
      error.message ===
      "Role not found"
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



/**
 * Create role
 */
export const addRole = (
  req,
  res
) => {

  try {

    const role =
      createRole(
        req.body
      );


    return res
      .status(201)
      .json(
        role
      );


  } catch (error) {

    if (
      error.message.includes(
        "required"
      )
    ) {

      return res
        .status(400)
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



/**
 * Update role
 */
export const updateRoleData = (
  req,
  res
) => {

  try {

    const role =
      editRole(
        req.params.id,
        req.body
      );


    return res
      .status(200)
      .json(
        role
      );


  } catch (error) {

    if (
      error.message ===
      "Role not found"
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



/**
 * Delete role
 */
export const removeRole = (
  req,
  res
) => {

  try {

    deleteRole(
      req.params.id
    );


    return res
      .status(200)
      .json({
        message:
          "Role deleted successfully",
      });


  } catch (error) {

    if (
      error.message ===
      "Role not found"
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



/**
 * Assign permissions to role
 */
export const assignPermissions = (
  req,
  res
) => {

  try {

    const result =
      updateRolePermissions(
        req.params.id,
        req.body.permissions
      );


    return res
      .status(200)
      .json(
        result
      );


  } catch (error) {

    if (
      error.message.includes(
        "Permissions"
      ) ||
      error.message.includes(
        "Invalid permissions"
      )
    ) {

      return res
        .status(400)
        .json({
          message:
            error.message,
        });

    }


    if (
      error.message ===
      "Role not found"
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



/**
 * Get role permissions
 */
export const getRolePermissionList = (
  req,
  res
) => {

  try {

    const permissions =
      getRolePermissions(
        req.params.id
      );


    return res
      .status(200)
      .json(
        permissions
      );


  } catch (error) {

    if (
      error.message ===
      "Role not found"
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