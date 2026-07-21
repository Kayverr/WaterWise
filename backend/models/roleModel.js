const defaultRoles = [
  {
    id: "role-001",
    name: "Admin",
    description: "Full system access",
    permissions: [
      "role.manage",
      "dashboard.view",
      "consumer.create",
      "consumer.update",
      "billing.view",
    ],
  },
  {
    id: "role-002",
    name: "Staff",
    description: "Limited administrative access",
    permissions: [
      "dashboard.view",
      "consumer.view",
      "billing.view",
    ],
  },
  {
    id: "role-003",
    name: "Meter Reader",
    description: "Meter reading access",
    permissions: ["meter.read"],
  },
];

const cloneRole = (role) => {
  return {
    ...role,
    permissions: [...role.permissions],
  };
};

const roles = defaultRoles.map(cloneRole);

/**
 * Generate a unique role ID.
 */
const generateRoleId = () => {
  return `role-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

/**
 * Get all roles.
 */
export const fetchRoles = () => {
  return roles.map(cloneRole);
};

/**
 * Get a role by ID.
 */
export const fetchRoleById = (id) => {
  const role = roles.find(
    (item) => item.id === id
  );

  return role ? cloneRole(role) : undefined;
};

/**
 * Insert a new role.
 */
export const insertRole = (roleData) => {
  const newRole = {
    id: generateRoleId(),
    name: roleData.name,
    description: roleData.description,
    permissions: Array.isArray(
      roleData.permissions
    )
      ? [...roleData.permissions]
      : [],
  };

  roles.push(newRole);

  return cloneRole(newRole);
};

/**
 * Update an existing role.
 */
export const updateRole = (
  id,
  updatedData
) => {
  const index = roles.findIndex(
    (role) => role.id === id
  );

  if (index === -1) {
    return null;
  }

  const existingRole = roles[index];

  roles[index] = {
    ...existingRole,
    ...updatedData,
    id: existingRole.id,
    permissions: existingRole.permissions,
  };

  return cloneRole(roles[index]);
};

/**
 * Delete a role.
 */
export const removeRoleById = (id) => {
  const index = roles.findIndex(
    (role) => role.id === id
  );

  if (index === -1) {
    return false;
  }

  roles.splice(index, 1);

  return true;
};

/**
 * Replace the permissions assigned to a role.
 */
export const setRolePermissions = (
  id,
  permissions
) => {
  const role = roles.find(
    (item) => item.id === id
  );

  if (!role) {
    return null;
  }

  role.permissions = [...permissions];

  return cloneRole(role);
};

/**
 * Restore the original roles.
 * Useful for model integration tests.
 */
export const resetRoles = () => {
  roles.splice(
    0,
    roles.length,
    ...defaultRoles.map(cloneRole)
  );
};