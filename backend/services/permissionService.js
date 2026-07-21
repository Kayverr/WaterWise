import {
  fetchPermissions,
  fetchPermissionById,
  fetchPermissionByName,
} from "../models/permissionModel.js";

/**
 * Get all permissions.
 */
export const getPermissions = () => {
  return fetchPermissions();
};

/**
 * Get a permission by ID.
 */
export const getPermissionById = (
  id
) => {
  if (!id) {
    throw new Error(
      "Permission ID is required"
    );
  }

  const permission =
    fetchPermissionById(id);

  if (!permission) {
    throw new Error(
      "Permission not found"
    );
  }

  return permission;
};

/**
 * Check whether a permission exists.
 */
export const validatePermission = (
  permissionName
) => {
  if (
    typeof permissionName !== "string" ||
    !permissionName.trim()
  ) {
    return false;
  }

  return Boolean(
    fetchPermissionByName(
      permissionName
    )
  );
};