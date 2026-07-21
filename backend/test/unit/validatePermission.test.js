import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/*
 * The mock must target the exact same
 * roleModel.js file used by the middleware.
 */
const roleModelMocks =
  vi.hoisted(() => ({
    fetchRoleById: vi.fn(),
  }));

vi.mock(
  "../../models/roleModel.js",
  () => ({
    fetchRoleById:
      roleModelMocks.fetchRoleById,
  })
);

import validatePermission from "../../middleware/validatePermission.js";

describe(
  "Validate Permission Middleware Tests",
  () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      vi.resetAllMocks();

      req = {
        user: {
          id: "user-001",
          roleId: "role-001",
        },
      };

      res = {
        status: vi.fn(),
        json: vi.fn(),
      };

      res.status.mockReturnValue(
        res
      );

      next = vi.fn();
    });

    describe(
      "Role Validation",
      () => {
        it("should return 403 when user role id is missing", () => {
          req.user = {
            id: "user-001",
          };

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).not.toHaveBeenCalled();

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "User role is required",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });

        it("should return 403 when user role does not exist", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue(
              undefined
            );

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledTimes(
            1
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "User role does not exist",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });
      }
    );

    describe(
      "Permission Checking",
      () => {
        it("should call next when user has required permission", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              name: "Admin",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );

          expect(
            res.status
          ).not.toHaveBeenCalled();

          expect(
            res.json
          ).not.toHaveBeenCalled();
        });

        it("should return 403 when permission is missing", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-002",
              name: "Staff",
              permissions: [
                "consumer.view",
              ],
            });

          const middleware =
            validatePermission(
              "role.manage"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "Permission denied",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });

        it("should allow users with multiple permissions", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              name: "Admin",
              permissions: [
                "role.manage",
                "dashboard.view",
                "billing.view",
              ],
            });

          const middleware =
            validatePermission(
              "billing.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );

          expect(
            res.status
          ).not.toHaveBeenCalled();

          expect(
            res.json
          ).not.toHaveBeenCalled();
        });

        it("should deny access when role permissions are missing", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              name: "Admin",
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "Permission denied",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });

        it("should deny access when permissions is not an array", () => {
          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              name: "Admin",
              permissions:
                "dashboard.view",
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "Permission denied",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });
      }
    );

    describe(
      "Supported user role formats",
      () => {
        it("should accept roleId", () => {
          req.user = {
            id: "user-001",
            roleId: "role-001",
          };

          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );
        });

        it("should accept role_id", () => {
          req.user = {
            id: "user-001",
            role_id: "role-002",
          };

          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-002",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-002"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );
        });

        it("should accept nested role id", () => {
          req.user = {
            id: "user-001",
            role: {
              id: "role-003",
            },
          };

          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-003",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-003"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );
        });

        it("should prioritize roleId over role_id", () => {
          req.user = {
            id: "user-001",
            roleId: "role-001",
            role_id: "role-002",
          };

          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-001",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-001"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );
        });

        it("should prioritize role_id over nested role id", () => {
          req.user = {
            id: "user-001",
            role_id: "role-002",
            role: {
              id: "role-003",
            },
          };

          roleModelMocks.fetchRoleById
            .mockReturnValue({
              id: "role-002",
              permissions: [
                "dashboard.view",
              ],
            });

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).toHaveBeenCalledWith(
            "role-002"
          );

          expect(
            next
          ).toHaveBeenCalledTimes(
            1
          );
        });
      }
    );

    describe(
      "Missing user data",
      () => {
        it("should return 403 when req.user is missing", () => {
          req.user = undefined;

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).not.toHaveBeenCalled();

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            res.json
          ).toHaveBeenCalledWith({
            message:
              "User role is required",
          });

          expect(
            next
          ).not.toHaveBeenCalled();
        });

        it("should return 403 when role object has no id", () => {
          req.user = {
            id: "user-001",
            role: {},
          };

          const middleware =
            validatePermission(
              "dashboard.view"
            );

          middleware(
            req,
            res,
            next
          );

          expect(
            roleModelMocks.fetchRoleById
          ).not.toHaveBeenCalled();

          expect(
            res.status
          ).toHaveBeenCalledWith(
            403
          );

          expect(
            next
          ).not.toHaveBeenCalled();
        });
      }
    );
  }
);