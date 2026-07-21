import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/*
 * These mocks must use the exact same resolved
 * modules imported by services/roleService.js.
 */
const modelMocks = vi.hoisted(() => ({
  fetchRoles: vi.fn(),
  fetchRoleById: vi.fn(),
  insertRole: vi.fn(),
  updateRole: vi.fn(),
  removeRoleById: vi.fn(),

  assignRolePermissions: vi.fn(),
  fetchRolePermissions: vi.fn(),

  fetchPermissionByName: vi.fn(),
}));

vi.mock(
  "../../models/roleModel.js",
  () => ({
    fetchRoles:
      modelMocks.fetchRoles,

    fetchRoleById:
      modelMocks.fetchRoleById,

    insertRole:
      modelMocks.insertRole,

    updateRole:
      modelMocks.updateRole,

    removeRoleById:
      modelMocks.removeRoleById,
  })
);

vi.mock(
  "../../models/rolePermissionModel.js",
  () => ({
    assignRolePermissions:
      modelMocks.assignRolePermissions,

    fetchRolePermissions:
      modelMocks.fetchRolePermissions,
  })
);

vi.mock(
  "../../models/permissionModel.js",
  () => ({
    fetchPermissionByName:
      modelMocks.fetchPermissionByName,
  })
);

import {
  createRole,
  deleteRole,
  editRole,
  getRoleById,
  getRolePermissions,
  getRoles,
  updateRolePermissions,
} from "../../services/roleService.js";

describe("Role Service Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    modelMocks.fetchRoles
      .mockReturnValue([]);

    modelMocks.fetchRoleById
      .mockReturnValue(undefined);

    modelMocks.fetchPermissionByName
      .mockImplementation(
        (permissionName) => ({
          id: `permission-${permissionName}`,
          name: permissionName,
        })
      );
  });

  describe("getRoles()", () => {
    it("should return all roles", () => {
      const roles = [
        {
          id: "role-001",
          name: "Admin",
          description:
            "Full system access",
          permissions: [
            "role.manage",
          ],
        },
        {
          id: "role-002",
          name: "Staff",
          description:
            "Limited access",
          permissions: [
            "dashboard.view",
          ],
        },
      ];

      modelMocks.fetchRoles
        .mockReturnValue(roles);

      const result = getRoles();

      expect(
        modelMocks.fetchRoles
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(roles);
    });
  });

  describe("getRoleById()", () => {
    it("should return role by id", () => {
      const role = {
        id: "role-001",
        name: "Admin",
        description:
          "Full system access",
        permissions: [
          "role.manage",
        ],
      };

      modelMocks.fetchRoleById
        .mockReturnValue(role);

      const result =
        getRoleById("role-001");

      expect(
        modelMocks.fetchRoleById
      ).toHaveBeenCalledWith(
        "role-001"
      );

      expect(result).toEqual(role);
    });

    it("should throw error when role id is missing", () => {
      expect(() => {
        getRoleById();
      }).toThrow(
        "Role ID is required"
      );

      expect(
        modelMocks.fetchRoleById
      ).not.toHaveBeenCalled();
    });

    it("should throw error when role does not exist", () => {
      modelMocks.fetchRoleById
        .mockReturnValue(undefined);

      expect(() => {
        getRoleById("role-999");
      }).toThrow("Role not found");

      expect(
        modelMocks.fetchRoleById
      ).toHaveBeenCalledWith(
        "role-999"
      );
    });
  });

  describe("createRole()", () => {
    it("should create role successfully", () => {
      const input = {
        name: "Manager",
        description:
          "Manages operations",
        permissions: [
          "dashboard.view",
        ],
      };

      const createdRole = {
        id: "role-004",
        ...input,
      };

      modelMocks.fetchRoles
        .mockReturnValue([]);

      modelMocks.insertRole
        .mockReturnValue(
          createdRole
        );

      const result =
        createRole(input);

      expect(
        modelMocks.fetchRoles
      ).toHaveBeenCalledTimes(1);

      expect(
        modelMocks.fetchPermissionByName
      ).toHaveBeenCalledWith(
        "dashboard.view"
      );

      expect(
        modelMocks.insertRole
      ).toHaveBeenCalledWith({
        name: "Manager",
        description:
          "Manages operations",
        permissions: [
          "dashboard.view",
        ],
      });

      expect(result).toEqual(
        createdRole
      );
    });

    it("should trim role data", () => {
      modelMocks.fetchRoles
        .mockReturnValue([]);

      modelMocks.insertRole
        .mockImplementation(
          (roleData) => ({
            id: "role-004",
            ...roleData,
          })
        );

      const result = createRole({
        name: "  Supervisor  ",
        description:
          "  Supervises operations  ",
      });

      expect(
        modelMocks.insertRole
      ).toHaveBeenCalledWith({
        name: "Supervisor",
        description:
          "Supervises operations",
        permissions: [],
      });

      expect(result).toEqual({
        id: "role-004",
        name: "Supervisor",
        description:
          "Supervises operations",
        permissions: [],
      });
    });

    it("should throw when role data is missing", () => {
      expect(() => {
        createRole();
      }).toThrow(
        "Role data is required"
      );
    });

    it("should require role name", () => {
      expect(() => {
        createRole({
          name: "",
          description:
            "Valid description",
        });
      }).toThrow(
        "Role name and description are required"
      );
    });

    it("should require role description", () => {
      expect(() => {
        createRole({
          name: "Manager",
          description: "",
        });
      }).toThrow(
        "Role name and description are required"
      );
    });

    it("should reject duplicate role names", () => {
      modelMocks.fetchRoles
        .mockReturnValue([
          {
            id: "role-001",
            name: "Admin",
            description:
              "Full access",
            permissions: [],
          },
        ]);

      expect(() => {
        createRole({
          name: "admin",
          description:
            "Duplicate role",
        });
      }).toThrow(
        "Role name already exists"
      );

      expect(
        modelMocks.insertRole
      ).not.toHaveBeenCalled();
    });

    it("should reject invalid permissions", () => {
      modelMocks.fetchRoles
        .mockReturnValue([]);

      modelMocks.fetchPermissionByName
        .mockReturnValue(undefined);

      expect(() => {
        createRole({
          name: "Custom Manager",
          description:
            "Custom management role",
          permissions: [
            "invalid.permission",
          ],
        });
      }).toThrow(
        "Invalid permissions found: invalid.permission"
      );

      expect(
        modelMocks.insertRole
      ).not.toHaveBeenCalled();
    });

    it("should remove duplicate permissions", () => {
      modelMocks.fetchRoles
        .mockReturnValue([]);

      modelMocks.insertRole
        .mockImplementation(
          (roleData) => ({
            id: "role-004",
            ...roleData,
          })
        );

      createRole({
        name: "Supervisor",
        description:
          "Supervises operations",
        permissions: [
          "dashboard.view",
          "dashboard.view",
          "billing.view",
        ],
      });

      expect(
        modelMocks.insertRole
      ).toHaveBeenCalledWith({
        name: "Supervisor",
        description:
          "Supervises operations",
        permissions: [
          "dashboard.view",
          "billing.view",
        ],
      });
    });
  });

  describe("editRole()", () => {
    it("should update existing role", () => {
      const existingRole = {
        id: "role-001",
        name: "Admin",
        description:
          "Full system access",
        permissions: [
          "role.manage",
        ],
      };

      const updatedRole = {
        ...existingRole,
        name: "Administrator",
        description:
          "Updated system access",
      };

      modelMocks.fetchRoleById
        .mockReturnValue(
          existingRole
        );

      modelMocks.fetchRoles
        .mockReturnValue([
          existingRole,
        ]);

      modelMocks.updateRole
        .mockReturnValue(
          updatedRole
        );

      const result = editRole(
        "role-001",
        {
          name: "Administrator",
          description:
            "Updated system access",
        }
      );

      expect(
        modelMocks.fetchRoleById
      ).toHaveBeenCalledWith(
        "role-001"
      );

      expect(
        modelMocks.updateRole
      ).toHaveBeenCalledWith(
        "role-001",
        {
          name: "Administrator",
          description:
            "Updated system access",
        }
      );

      expect(result).toEqual(
        updatedRole
      );
    });

    it("should update only the description", () => {
      const existingRole = {
        id: "role-001",
        name: "Admin",
        description:
          "Full system access",
        permissions: [],
      };

      modelMocks.fetchRoleById
        .mockReturnValue(
          existingRole
        );

      modelMocks.updateRole
        .mockReturnValue({
          ...existingRole,
          description:
            "New description",
        });

      editRole(
        "role-001",
        {
          description:
            "  New description  ",
        }
      );

      expect(
        modelMocks.fetchRoles
      ).not.toHaveBeenCalled();

      expect(
        modelMocks.updateRole
      ).toHaveBeenCalledWith(
        "role-001",
        {
          description:
            "New description",
        }
      );
    });

    it("should throw when role id is missing", () => {
      expect(() => {
        editRole(undefined, {
          name: "Manager",
        });
      }).toThrow(
        "Role ID is required"
      );
    });

    it("should throw when update data is missing", () => {
      expect(() => {
        editRole("role-001");
      }).toThrow(
        "Role data is required"
      );
    });

    it("should throw when role does not exist", () => {
      modelMocks.fetchRoleById
        .mockReturnValue(undefined);

      expect(() => {
        editRole(
          "role-999",
          {
            name: "Unknown",
          }
        );
      }).toThrow("Role not found");

      expect(
        modelMocks.updateRole
      ).not.toHaveBeenCalled();
    });

    it("should reject duplicate role name", () => {
      modelMocks.fetchRoleById
        .mockReturnValue({
          id: "role-002",
          name: "Staff",
          description:
            "Limited access",
          permissions: [],
        });

      modelMocks.fetchRoles
        .mockReturnValue([
          {
            id: "role-001",
            name: "Admin",
          },
          {
            id: "role-002",
            name: "Staff",
          },
        ]);

      expect(() => {
        editRole(
          "role-002",
          {
            name: "admin",
          }
        );
      }).toThrow(
        "Role name already exists"
      );

      expect(
        modelMocks.updateRole
      ).not.toHaveBeenCalled();
    });

    it("should allow keeping the same role name", () => {
      const existingRole = {
        id: "role-001",
        name: "Admin",
        description:
          "Full system access",
        permissions: [],
      };

      modelMocks.fetchRoleById
        .mockReturnValue(
          existingRole
        );

      modelMocks.fetchRoles
        .mockReturnValue([
          existingRole,
        ]);

      modelMocks.updateRole
        .mockReturnValue(
          existingRole
        );

      expect(() => {
        editRole(
          "role-001",
          {
            name: "Admin",
          }
        );
      }).not.toThrow();
    });
  });

  describe("deleteRole()", () => {
    it("should delete existing role", () => {
      modelMocks.fetchRoleById
        .mockReturnValue({
          id: "role-001",
          name: "Admin",
          description:
            "Full access",
          permissions: [],
        });

      modelMocks.removeRoleById
        .mockReturnValue(true);

      const result =
        deleteRole("role-001");

      expect(
        modelMocks.fetchRoleById
      ).toHaveBeenCalledWith(
        "role-001"
      );

      expect(
        modelMocks.removeRoleById
      ).toHaveBeenCalledWith(
        "role-001"
      );

      expect(result).toBe(true);
    });

    it("should throw when role id is missing", () => {
      expect(() => {
        deleteRole();
      }).toThrow(
        "Role ID is required"
      );
    });

    it("should throw error when deleting invalid role", () => {
      modelMocks.fetchRoleById
        .mockReturnValue(undefined);

      expect(() => {
        deleteRole("role-999");
      }).toThrow("Role not found");

      expect(
        modelMocks.removeRoleById
      ).not.toHaveBeenCalled();
    });
  });

  describe(
    "updateRolePermissions()",
    () => {
      it("should assign permissions successfully", () => {
        const permissions = [
          "dashboard.view",
          "billing.view",
        ];

        const updatedRole = {
          id: "role-001",
          name: "Admin",
          permissions,
        };

        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            name: "Admin",
            permissions: [],
          });

        modelMocks.assignRolePermissions
          .mockReturnValue(
            updatedRole
          );

        const result =
          updateRolePermissions(
            "role-001",
            permissions
          );

        expect(
          modelMocks.fetchRoleById
        ).toHaveBeenCalledWith(
          "role-001"
        );

        expect(
          modelMocks.fetchPermissionByName
        ).toHaveBeenCalledTimes(2);

        expect(
          modelMocks.assignRolePermissions
        ).toHaveBeenCalledWith(
          "role-001",
          permissions
        );

        expect(result).toEqual(
          updatedRole
        );
      });

      it("should remove duplicate permissions", () => {
        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            permissions: [],
          });

        modelMocks.assignRolePermissions
          .mockReturnValue({
            id: "role-001",
            permissions: [
              "dashboard.view",
            ],
          });

        updateRolePermissions(
          "role-001",
          [
            "dashboard.view",
            "dashboard.view",
          ]
        );

        expect(
          modelMocks.assignRolePermissions
        ).toHaveBeenCalledWith(
          "role-001",
          ["dashboard.view"]
        );
      });

      it("should trim permission names", () => {
        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            permissions: [],
          });

        modelMocks.assignRolePermissions
          .mockReturnValue({
            id: "role-001",
            permissions: [
              "dashboard.view",
            ],
          });

        updateRolePermissions(
          "role-001",
          [
            "  dashboard.view  ",
          ]
        );

        expect(
          modelMocks.fetchPermissionByName
        ).toHaveBeenCalledWith(
          "dashboard.view"
        );

        expect(
          modelMocks.assignRolePermissions
        ).toHaveBeenCalledWith(
          "role-001",
          ["dashboard.view"]
        );
      });

      it("should throw when role id is missing", () => {
        expect(() => {
          updateRolePermissions(
            undefined,
            ["dashboard.view"]
          );
        }).toThrow(
          "Role ID is required"
        );
      });

      it("should throw when permissions are not an array", () => {
        expect(() => {
          updateRolePermissions(
            "role-001",
            "dashboard.view"
          );
        }).toThrow(
          "Permissions must be an array"
        );
      });

      it("should throw when permissions are empty", () => {
        expect(() => {
          updateRolePermissions(
            "role-001",
            []
          );
        }).toThrow(
          "Permissions cannot be empty"
        );
      });

      it("should throw when normalized permissions are empty", () => {
        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            permissions: [],
          });

        expect(() => {
          updateRolePermissions(
            "role-001",
            ["", "   "]
          );
        }).toThrow(
          "Permissions cannot be empty"
        );

        expect(
          modelMocks.assignRolePermissions
        ).not.toHaveBeenCalled();
      });

      it("should throw when role does not exist", () => {
        modelMocks.fetchRoleById
          .mockReturnValue(undefined);

        expect(() => {
          updateRolePermissions(
            "role-999",
            ["dashboard.view"]
          );
        }).toThrow(
          "Role not found"
        );

        expect(
          modelMocks.assignRolePermissions
        ).not.toHaveBeenCalled();
      });

      it("should reject invalid permissions", () => {
        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            permissions: [],
          });

        modelMocks.fetchPermissionByName
          .mockImplementation(
            (permissionName) => {
              if (
                permissionName ===
                "invalid.permission"
              ) {
                return undefined;
              }

              return {
                id: `permission-${permissionName}`,
                name: permissionName,
              };
            }
          );

        expect(() => {
          updateRolePermissions(
            "role-001",
            [
              "invalid.permission",
            ]
          );
        }).toThrow(
          "Invalid permissions found: invalid.permission"
        );

        expect(
          modelMocks.assignRolePermissions
        ).not.toHaveBeenCalled();
      });
    }
  );

  describe(
    "getRolePermissions()",
    () => {
      it("should return role permissions", () => {
        const permissions = [
          "role.manage",
          "dashboard.view",
        ];

        modelMocks.fetchRoleById
          .mockReturnValue({
            id: "role-001",
            name: "Admin",
            permissions,
          });

        modelMocks.fetchRolePermissions
          .mockReturnValue(
            permissions
          );

        const result =
          getRolePermissions(
            "role-001"
          );

        expect(
          modelMocks.fetchRoleById
        ).toHaveBeenCalledWith(
          "role-001"
        );

        expect(
          modelMocks.fetchRolePermissions
        ).toHaveBeenCalledWith(
          "role-001"
        );

        expect(result).toEqual(
          permissions
        );
      });

      it("should throw when role id is missing", () => {
        expect(() => {
          getRolePermissions();
        }).toThrow(
          "Role ID is required"
        );
      });

      it("should throw when role does not exist", () => {
        modelMocks.fetchRoleById
          .mockReturnValue(undefined);

        expect(() => {
          getRolePermissions(
            "role-999"
          );
        }).toThrow(
          "Role not found"
        );

        expect(
          modelMocks.fetchRolePermissions
        ).not.toHaveBeenCalled();
      });
    }
  );
});