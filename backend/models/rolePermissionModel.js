import {
  fetchRoleById,
  setRolePermissions,
} from "./roleModel.js";

/**
 * Assign permissions to a role.
 */
export const assignRolePermissions = (
  roleId,
  permissions
) => {
  if (!Array.isArray(permissions)) {
    return null;
  }

  return setRolePermissions(
    roleId,
    permissions
  );
};

/**
 * Get the permissions assigned to a role.
 */
export const fetchRolePermissions = (
  roleId
) => {
  const role = fetchRoleById(roleId);

  if (!role) {
    return null;
  }

  return [...role.permissions];
};