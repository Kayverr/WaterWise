export const mockPermissions = [
  {
    id: "perm-001",
    name: "dashboard.view",
    module: "Dashboard",
    action: "View",
    description:
      "Allow user to view dashboard analytics",
  },

  {
    id: "perm-002",
    name: "consumer.view",
    module: "Consumer",
    action: "View",
    description:
      "Allow user to view consumer records",
  },

  {
    id: "perm-003",
    name: "consumer.create",
    module: "Consumer",
    action: "Create",
    description:
      "Allow user to create consumer records",
  },

  {
    id: "perm-004",
    name: "consumer.update",
    module: "Consumer",
    action: "Update",
    description:
      "Allow user to update consumer records",
  },

  {
    id: "perm-005",
    name: "billing.view",
    module: "Billing",
    action: "View",
    description:
      "Allow user to view billing records",
  },

  {
    id: "perm-006",
    name: "billing.payment",
    module: "Billing",
    action: "Payment",
    description:
      "Allow user to process payments",
  },

  {
    id: "perm-007",
    name: "reading.create",
    module: "Meter Reading",
    action: "Create",
    description:
      "Allow user to create meter readings",
  },

  {
    id: "perm-008",
    name: "reading.update",
    module: "Meter Reading",
    action: "Update",
    description:
      "Allow user to update meter readings",
  },

  {
    id: "perm-009",
    name: "role.manage",
    module: "Role",
    action: "Manage",
    description:
      "Allow user to manage roles and permissions",
  },
];