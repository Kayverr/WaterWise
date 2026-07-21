import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import request from "supertest";
import express from "express";


// Controller mocks
const {
  getAllRoles,
  getRole,
  addRole,
  updateRoleData,
  removeRole,
  assignPermissions,
  getRolePermissionList,
} = vi.hoisted(() => ({
  getAllRoles:
    vi.fn(),

  getRole:
    vi.fn(),

  addRole:
    vi.fn(),

  updateRoleData:
    vi.fn(),

  removeRole:
    vi.fn(),

  assignPermissions:
    vi.fn(),

  getRolePermissionList:
    vi.fn(),
}));


// Permission controller mocks
const {
  getAllPermissions,
  getPermission,
} = vi.hoisted(() => ({
  getAllPermissions:
    vi.fn(),

  getPermission:
    vi.fn(),
}));


// Middleware mocks
const {
  authenticateUser,
  validatePermission,
} = vi.hoisted(() => ({

  authenticateUser:
    vi.fn(),

  validatePermission:
    vi.fn(),

}));


// Controller mocks

vi.mock(
  "../../controllers/roleController.js",
  () => ({
    getAllRoles,
    getRole,
    addRole,
    updateRoleData,
    removeRole,
    assignPermissions,
    getRolePermissionList,
  })
);



vi.mock(
  "../../controllers/permissionController.js",
  () => ({
    getAllPermissions,
    getPermission,
  })
);



// Middleware mocks

vi.mock(
  "../../middleware/authenticateUser.js",
  () => ({
    authenticateUser,
  })
);



vi.mock(
  "../../middleware/validatePermission.js",
  () => ({
    validatePermission,
  })
);



// Dynamic routes

let roleRoutes;

let permissionRoutes;

let app;



beforeEach(
  async () => {

    vi.clearAllMocks();


    authenticateUser.mockImplementation(
      (
        req,
        res,
        next
      ) => {

        req.user = {

          id:
            "user-001",

          roleId:
            "role-001",

        };


        next();

      }
    );



    validatePermission.mockImplementation(
      () => (
        req,
        res,
        next
      ) => {

        next();

      }
    );



    vi.resetModules();



    roleRoutes =
      (
        await import(
          "../../routes/roleRoutes.js"
        )
      )
      .default;



    permissionRoutes =
      (
        await import(
          "../../routes/permissionRoutes.js"
        )
      )
      .default;



    app =
      express();



    app.use(
      express.json()
    );



    app.use(
      "/api/roles",
      roleRoutes
    );



    app.use(
      "/api/permissions",
      permissionRoutes
    );


  }
);



describe(
  "Role API Integration Tests",
  () => {

        describe(
      "GET /api/roles",
      () => {


        it(
          "should return all roles successfully",
          async () => {


            // Arrange
            getAllRoles.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json([
                    {
                      id:
                        "role-001",

                      name:
                        "Admin",

                      permissions:[
                        "role.manage",
                      ],
                    },
                  ]);

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);


            expect(
              getAllRoles
            )
            .toHaveBeenCalled();


            expect(
              response.body[0].name
            )
            .toBe(
              "Admin"
            );


          }
        );



      }
    );



    describe(
      "GET /api/roles/:id",
      () => {


        it(
          "should return role successfully",
          async () => {


            // Arrange
            getRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json({

                    id:
                      req.params.id,

                    name:
                      "Admin",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles/role-001"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);



            expect(
              response.body.id
            )
            .toBe(
              "role-001"
            );


          }
        );



        it(
          "should return 404 when role is not found",
          async () => {


            // Arrange
            getRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(404)
                  .json({

                    message:
                      "Role not found",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles/invalid"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(404);


          }
        );


      }
    );



    describe(
      "POST /api/roles",
      () => {


        it(
          "should create role successfully",
          async () => {


            // Arrange
            addRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(201)
                  .json({

                    id:
                      "role-002",

                    name:
                      req.body.name,

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .post(
                "/api/roles"
              )
              .send({

                name:
                  "Manager",

                description:
                  "Manage users",

              });



            // Assert
            expect(
              response.status
            )
            .toBe(201);


            expect(
              response.body.name
            )
            .toBe(
              "Manager"
            );


          }
        );



        it(
          "should reject invalid role data",
          async () => {


            // Arrange
            addRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(400)
                  .json({

                    message:
                      "Invalid input",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .post(
                "/api/roles"
              )
              .send({});



            // Assert
            expect(
              response.status
            )
            .toBe(400);


          }
        );


      }
    );



    describe(
      "PUT /api/roles/:id",
      () => {


        it(
          "should update role successfully",
          async () => {


            // Arrange
            updateRoleData.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json({

                    id:
                      req.params.id,

                    name:
                      req.body.name,

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .put(
                "/api/roles/role-001"
              )
              .send({

                name:
                  "Updated Admin",

              });



            // Assert
            expect(
              response.status
            )
            .toBe(200);



            expect(
              response.body.name
            )
            .toBe(
              "Updated Admin"
            );


          }
        );


      }
    );

        describe(
      "DELETE /api/roles/:id",
      () => {


        it(
          "should delete role successfully",
          async () => {


            // Arrange
            removeRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json({

                    message:
                      "Role deleted successfully",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .delete(
                "/api/roles/role-001"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);



          }
        );



        it(
          "should return 404 when role does not exist",
          async () => {


            // Arrange
            removeRole.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(404)
                  .json({

                    message:
                      "Role not found",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .delete(
                "/api/roles/invalid"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(404);


          }
        );


      }
    );



    describe(
      "PUT /api/roles/:id/permissions",
      () => {


        it(
          "should assign permissions successfully",
          async () => {


            // Arrange
            assignPermissions.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json({

                    id:
                      req.params.id,

                    permissions:
                      req.body.permissions,

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .put(
                "/api/roles/role-001/permissions"
              )
              .send({

                permissions:[
                  "dashboard.view",
                  "consumer.create",
                ],

              });



            // Assert
            expect(
              response.status
            )
            .toBe(200);



            expect(
              response.body.permissions
            )
            .toContain(
              "dashboard.view"
            );


          }
        );



        it(
          "should reject invalid permission payload",
          async () => {


            // Arrange
            assignPermissions.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(400)
                  .json({

                    message:
                      "Permissions must be an array",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .put(
                "/api/roles/role-001/permissions"
              )
              .send({

                permissions:
                  "invalid",

              });



            // Assert
            expect(
              response.status
            )
            .toBe(400);


          }
        );


      }
    );



    describe(
      "GET /api/roles/:id/permissions",
      () => {


        it(
          "should return role permissions",
          async () => {


            // Arrange
            getRolePermissionList.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json([

                    "dashboard.view",

                    "consumer.create",

                  ]);

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles/role-001/permissions"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);



            expect(
              response.body
            )
            .toContain(
              "dashboard.view"
            );


          }
        );


      }
    );



    describe(
      "GET /api/permissions",
      () => {


        it(
          "should return all permissions",
          async () => {


            // Arrange
            getAllPermissions.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json([

                    {
                      id:
                        "permission-001",

                      name:
                        "dashboard.view",

                    },

                  ]);

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/permissions"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);



            expect(
              response.body[0].name
            )
            .toBe(
              "dashboard.view"
            );


          }
        );


      }
    );



    describe(
      "GET /api/permissions/:id",
      () => {


        it(
          "should return permission details",
          async () => {


            // Arrange
            getPermission.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json({

                    id:
                      req.params.id,

                    name:
                      "dashboard.view",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/permissions/permission-001"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);


          }
        );


      }
    );



    describe(
      "Role API Authorization Tests",
      () => {


        it(
          "should allow authenticated user with permission",
          async () => {


            // Arrange
            getAllRoles.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(200)
                  .json([]);

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(200);


          }
        );



        it(
          "should reject unauthenticated user",
          async () => {


            // Arrange
            authenticateUser.mockImplementation(
              (
                req,
                res
              ) => {

                res
                  .status(401)
                  .json({

                    message:
                      "Unauthorized",

                  });

              }
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(401);


          }
        );



        it(
          "should reject user without permission",
          async () => {


            // Arrange
            validatePermission.mockImplementation(
              () => (
                req,
                res,
                next
              ) => {

                return res
                  .status(403)
                  .json({

                    message:
                      "Forbidden",

                  });

              }
            );



            // IMPORTANT:
            // Reload routes after changing middleware mock
            vi.resetModules();


            roleRoutes =
              (
                await import(
                  "../../routes/roleRoutes.js"
                )
              )
              .default;



            app =
              express();


            app.use(
              express.json()
            );


            app.use(
              "/api/roles",
              roleRoutes
            );



            // Act
            const response =
              await request(app)
              .get(
                "/api/roles"
              );



            // Assert
            expect(
              response.status
            )
            .toBe(403);


          }
        );


      }
    );


  }
);