import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock(
  "../../services/AuthService.js",
  () => ({

    getCurrentUser: vi.fn(),
    isAuthenticated: vi.fn(),

  })
);

import {
  getCurrentUser,
  isAuthenticated,
} from "../../services/AuthService.js";

import {
  authenticate,
  authenticateWithUser,
} from "../../middleware/AuthMiddleware.js";

describe(
  "Authentication Middleware",
  () => {

    let req;
    let res;
    let next;

    beforeEach(() => {

      vi.clearAllMocks();

      req = {};

      res = {

        status:
          vi.fn()
          .mockReturnThis(),

        json:
          vi.fn(),

      };

      next =
        vi.fn();

    });

    it(
      "It should allow authenticated users to access protected routes.",
      () => {

        // Arrange

        isAuthenticated
          .mockReturnValue(true);

        // Act

        authenticate(
          req,
          res,
          next
        );

        // Assert

        expect(
          isAuthenticated
        )
        .toHaveBeenCalled();

        expect(
          next
        )
        .toHaveBeenCalled();

        expect(
          res.status
        )
        .not
        .toHaveBeenCalled();

      }
    );

    it(
      "It should block unauthenticated users from accessing protected routes.",
      () => {

        // Arrange

        isAuthenticated
          .mockReturnValue(false);

        // Act

        authenticate(
          req,
          res,
          next
        );

        // Assert

        expect(
          isAuthenticated
        )
        .toHaveBeenCalled();

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
            "Unauthorized.",

        });

        expect(
          next
        )
        .not
        .toHaveBeenCalled();

      }
    );

    it("attaches the active user to protected portal requests", async () => {
      const user = { id: 2, role: "tenant" };
      getCurrentUser.mockResolvedValue(user);

      await authenticateWithUser(req, res, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalledOnce();
    });

    it("rejects portal requests without an active user", async () => {
      getCurrentUser.mockRejectedValue(new Error("Unauthorized."));

      await authenticateWithUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

  }
);
