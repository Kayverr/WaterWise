import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock(
  "../services/AuthService.js",
  () => ({

    loginUser: vi.fn(),

    logoutUser: vi.fn(),

    getCurrentUser: vi.fn(),

  })
);

import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/AuthService.js";

import {
  login,
  logout,
  currentUser,
} from "../controllers/AuthController.js";


describe(
  "Authentication Controller",
  () => {

    let req;
    let res;

    beforeEach(() => {

      vi.clearAllMocks();

      req = {

        body:{},

      };

      res = {

        status:
          vi.fn()
          .mockReturnThis(),

        json:
          vi.fn(),

      };

    });


    describe(
      "Login Controller",
      () => {

        it(
          "It should login user successfully.",
          async()=>{

            // Arrange

            req.body = {

              email:
                "admin@gmail.com",

              password:
                "admin123",

            };

            loginUser.mockResolvedValue({

              id:1,

              name:
                "System Administrator",

              email:
                "admin@gmail.com",

              role:
                "admin",

            });

            // Act

            await login(
              req,
              res
            );

            // Assert

            expect(
              loginUser
            )
            .toHaveBeenCalledWith(
              req.body
            );

            expect(
              res.status
            )
            .toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            )
            .toHaveBeenCalledWith({

              success:true,

              message:
                "Login successful.",

              user:{

                id:1,

                name:
                  "System Administrator",

                email:
                  "admin@gmail.com",

                role:
                  "admin",

              },

            });

          }
        );


        it(
          "It should return error when login fails.",
          async()=>{

            // Arrange

            loginUser.mockRejectedValue(
              new Error(
                "Invalid email or password."
              )
            );

            // Act

            await login(
              req,
              res
            );

            // Assert

            expect(
              res.status
            )
            .toHaveBeenCalledWith(
              401
            );

            expect(
              res.json
            )
            .toHaveBeenCalledWith({

              success:false,

              message:
                "Invalid email or password.",

            });

          }
        );

      }
    );


    describe(
      "Logout Controller",
      ()=>{

        it(
          "It should logout user successfully.",
          async()=>{

            // Arrange

            logoutUser.mockResolvedValue({

              message:
                "Logout successful.",

            });

            // Act

            await logout(
              req,
              res
            );

            // Assert

            expect(
              res.status
            )
            .toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            )
            .toHaveBeenCalledWith({

              success:true,

              message:
                "Logout successful.",

            });

          }
        );

      }
    );


    describe(
      "Current User Controller",
      ()=>{

        it(
          "It should return current authenticated user.",
          async()=>{

            // Arrange

            getCurrentUser.mockResolvedValue({

              id:1,

              email:
                "admin@gmail.com",

              role:
                "admin",

            });

            // Act

            await currentUser(
              req,
              res
            );

            // Assert

            expect(
              res.status
            )
            .toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            )
            .toHaveBeenCalledWith({

              success:true,

              user:{

                id:1,

                email:
                  "admin@gmail.com",

                role:
                  "admin",

              },

            });


          }
        );


      }
    );

  }
);