const permissions = [
  {
    id: "permission-001",
    name: "role.manage",
    description: "Manage system roles",
  },
  {
    id: "permission-002",
    name: "dashboard.view",
    description: "View the dashboard",
  },
  {
    id: "permission-003",
    name: "consumer.create",
    description: "Create consumers",
  },
  {
    id: "permission-004",
    name: "consumer.view",
    description: "View consumers",
  },
  {
    id: "permission-005",
    name: "consumer.update",
    description: "Update consumers",
  },
  {
    id: "permission-006",
    name: "billing.view",
    description: "View billing records",
  },
  {
    id: "permission-007",
    name: "meter.read",
    description: "Record meter readings",
  },
];

const clonePermission = (permission) => {
  return {
    ...permission,
  };
};

/**
 * Get all permissions.
 */
export const fetchPermissions = () => {
  return permissions.map(
    clonePermission
  );
};

/**
 * Get a permission by ID.
 */
export const fetchPermissionById = (
  id
) => {
  const permission = permissions.find(
    (item) => item.id === id
  );

  return permission
    ? clonePermission(permission)
    : undefined;
};

/**
 * Get a permission by name.
 */
export const fetchPermissionByName = (
  name
) => {
  if (typeof name !== "string") {
    return undefined;
  }

  const normalizedName = name
    .trim()
    .toLowerCase();

  if (!normalizedName) {
    return undefined;
  }

  const permission = permissions.find(
    (item) =>
      item.name.toLowerCase() ===
      normalizedName
  );

  return permission
    ? clonePermission(permission)
    : undefined;
};