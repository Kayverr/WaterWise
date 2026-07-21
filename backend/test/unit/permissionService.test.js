import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";


import {
  getPermissions,
  getPermissionById,
  validatePermission,
} from "/services/permissionService.js";


import * as permissionModel
from "/models/permissionModel.js";



vi.mock(
  "/models/permissionModel.js",
  () => ({

    fetchPermissions: vi.fn(),

    fetchPermissionById: vi.fn(),

    fetchPermissionByName: vi.fn(),

  })
);



describe(
  "Permission Service Tests",
  () => {


    beforeEach(() => {

      vi.clearAllMocks();

    });



    describe(
      "getPermissions()",
      () => {


        it(
          "should return all permissions",
          () => {


            // Arrange

            permissionModel.fetchPermissions
              .mockReturnValue([
                {
                  id:"perm-001",
                  name:
                  "dashboard.view"
                },
                {
                  id:"perm-002",
                  name:
                  "consumer.create"
                }
              ]);



            // Act

            const result =
              getPermissions();



            // Assert

            expect(result)
              .toHaveLength(2);



            expect(
              permissionModel.fetchPermissions
            )
            .toHaveBeenCalled();


          }
        );


      }
    );



    describe(
      "getPermissionById()",
      () => {



        it(
          "should return permission when id exists",
          () => {


            // Arrange

            permissionModel.fetchPermissionById
              .mockReturnValue({
                id:"perm-001",
                name:
                "dashboard.view"
              });



            // Act

            const result =
              getPermissionById(
                "perm-001"
              );



            // Assert

            expect(
              result.id
            )
            .toBe(
              "perm-001"
            );

          }
        );


        it(
          "should throw error when permission does not exist",
          () => {

            // Arrange

            permissionModel.fetchPermissionById
              .mockReturnValue(
                undefined
              );

            // Act + Assert

            expect(
              () =>
                getPermissionById(
                  "invalid-id"
                )
            )
            .toThrow(
              "Permission not found"
            );

          }
        );


      }
    );

    describe(
      "validatePermission()",
      () => {

        it(
          "should return true for existing permission",
          () => {

            // Arrange

            permissionModel.fetchPermissionByName
              .mockReturnValue({
                id:"perm-001",
                name:
                "dashboard.view"
              });

            // Act

            const result =
              validatePermission(
                "dashboard.view"
              );

            // Assert

            expect(result)
              .toBe(true);

            expect(
              permissionModel.fetchPermissionByName
            )
            .toHaveBeenCalledWith(
              "dashboard.view"
            );

          }
        );

        it(
          "should return false for invalid permission",
          () => {

            // Arrange

            permissionModel.fetchPermissionByName
              .mockReturnValue(
                undefined
              );

            // Act

            const result =
              validatePermission(
                "invalid.permission"
              );

            // Assert

            expect(result)
              .toBe(false);

          }
        );

      }
    );

  }
);