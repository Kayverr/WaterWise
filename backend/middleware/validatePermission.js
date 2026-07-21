import {
  fetchRoleById,
} from "../models/roleModel.js";

/**
 * Require a permission before allowing access.
 */
const validatePermission = (
  requiredPermission
) => {
  return (req, res, next) => {
    const roleId =
      req.user?.roleId ??
      req.user?.role_id ??
      req.user?.role?.id;

    if (!roleId) {
      return res.status(403).json({
        message:
          "User role is required",
      });
    }

    const role =
      fetchRoleById(roleId);

    if (!role) {
      return res.status(403).json({
        message:
          "User role does not exist",
      });
    }

    const permissions =
      Array.isArray(
        role.permissions
      )
        ? role.permissions
        : [];

    if (
      !permissions.includes(
        requiredPermission
      )
    ) {
      return res.status(403).json({
        message:
          "Permission denied",
      });
    }

    return next();
  };
};

export default validatePermission;

export {
  validatePermission,
};