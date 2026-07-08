import express from "express";

import {
  login,
  logout,
  currentUser,
} from "../controllers/AuthController.js";

import {
  authenticate,
} from "../middleware/AuthMiddleware.js";

const router = express.Router();

/**
 * Public Routes
 */

router.post(
  "/login",
  login
);

/**
 * Protected Routes
 */

router.post(
  "/logout",
  authenticate,
  logout
);

router.get(
  "/me",
  authenticate,
  currentUser
);

export default router;