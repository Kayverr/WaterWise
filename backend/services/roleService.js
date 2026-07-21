import {
  fetchRoles,
  fetchRoleById,
  insertRole,
  updateRole,
  removeRoleById,
} from "../models/roleModel.js";

import {
  assignRolePermissions,
  fetchRolePermissions,
} from "../models/rolePermissionModel.js";

import {
  fetchPermissionByName,
} from "../models/permissionModel.js";

/**
 * Normalize a list of permission names.
 */
const normalizePermissions = (
  permissions
) => {
  return [
    ...new Set(
      permissions
        .filter(
          (permission) =>
            typeof permission === "string"
        )
        .map((permission) =>
          permission.trim()
        )
        .filter(Boolean)
    ),
  ];
};

/**
 * Validate permission names.
 */
const validatePermissions = (
  permissions
) => {
  const invalidPermissions =
    permissions.filter(
      (permission) =>
        !fetchPermissionByName(
          permission
        )
    );

  if (invalidPermissions.length > 0) {
    throw new Error(
      `Invalid permissions found: ${invalidPermissions.join(
        ", "
      )}`
    );
  }
};

/**
 * Get all roles.
 */
export const getRoles = () => {
  return fetchRoles();
};

/**
 * Get a role by ID.
 */
export const getRoleById = (id) => {
  if (!id) {
    throw new Error(
      "Role ID is required"
    );
  }

  const role = fetchRoleById(id);

  if (!role) {
    throw new Error(
      "Role not found"
    );
  }

  return role;
};

/**
 * Create a new role.
 */
export const createRole = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Role data is required"
    );
  }

  const name = data.name?.trim();
  const description =
    data.description?.trim();

  if (!name || !description) {
    throw new Error(
      "Role name and description are required"
    );
  }

  const existingRoles = fetchRoles();

  const duplicateRole =
    existingRoles.find(
      (role) =>
        role.name.toLowerCase() ===
        name.toLowerCase()
    );

  if (duplicateRole) {
    throw new Error(
      "Role name already exists"
    );
  }

  const permissions =
    Array.isArray(data.permissions)
      ? normalizePermissions(
          data.permissions
        )
      : [];

  validatePermissions(permissions);

  return insertRole({
    name,
    description,
    permissions,
  });
};

/**
 * Update an existing role.
 */
export const editRole = (
  id,
  data
) => {
  if (!id) {
    throw new Error(
      "Role ID is required"
    );
  }

  if (!data || typeof data !== "object") {
    throw new Error(
      "Role data is required"
    );
  }

  const existingRole =
    fetchRoleById(id);

  if (!existingRole) {
    throw new Error(
      "Role not found"
    );
  }

  const updatedData = {};

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "name"
    )
  ) {
    const name = data.name?.trim();

    if (!name) {
      throw new Error(
        "Role name is required"
      );
    }

    const duplicateRole =
      fetchRoles().find(
        (role) =>
          role.id !== id &&
          role.name.toLowerCase() ===
            name.toLowerCase()
      );

    if (duplicateRole) {
      throw new Error(
        "Role name already exists"
      );
    }

    updatedData.name = name;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "description"
    )
  ) {
    const description =
      data.description?.trim();

    if (!description) {
      throw new Error(
        "Role description is required"
      );
    }

    updatedData.description =
      description;
  }

  return updateRole(
    id,
    updatedData
  );
};

/**
 * Delete a role.
 */
export const deleteRole = (id) => {
  if (!id) {
    throw new Error(
      "Role ID is required"
    );
  }

  const role = fetchRoleById(id);

  if (!role) {
    throw new Error(
      "Role not found"
    );
  }

  return removeRoleById(id);
};

/**
 * Replace the permissions of a role.
 */
export const updateRolePermissions = (
  roleId,
  permissions
) => {
  if (!roleId) {
    throw new Error(
      "Role ID is required"
    );
  }

  if (!Array.isArray(permissions)) {
    throw new Error(
      "Permissions must be an array"
    );
  }

  if (permissions.length === 0) {
    throw new Error(
      "Permissions cannot be empty"
    );
  }

  const role = fetchRoleById(roleId);

  if (!role) {
    throw new Error(
      "Role not found"
    );
  }

  const normalizedPermissions =
    normalizePermissions(permissions);

  if (
    normalizedPermissions.length === 0
  ) {
    throw new Error(
      "Permissions cannot be empty"
    );
  }

  validatePermissions(
    normalizedPermissions
  );

  return assignRolePermissions(
    roleId,
    normalizedPermissions
  );
};

/**
 * Get the permissions assigned to a role.
 */
export const getRolePermissions = (
  roleId
) => {
  if (!roleId) {
    throw new Error(
      "Role ID is required"
    );
  }

  const role = fetchRoleById(
    roleId
  );

  if (!role) {
    throw new Error(
      "Role not found"
    );
  }

  return fetchRolePermissions(
    roleId
  );
};