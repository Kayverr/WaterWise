export const mockRoles = [
  {
    id: "role-001",
    name: "Admin",
    description: "Full system access",
    permissions: [
      "dashboard.view",
      "consumer.create",
      "consumer.update",
      "billing.view",
      "billing.payment",
      "role.manage",
    ],
    status: "active",
  },
  {
    id: "role-002",
    name: "Meter Reader",
    description: "Manage meter reading records",
    permissions: [
      "reading.create",
      "reading.update",
    ],
    status: "active",
  },
  {
    id: "role-003",
    name: "Staff",
    description: "Limited system access",
    permissions: [
      "consumer.view",
      "billing.view",
    ],
    status: "active",
  },
];