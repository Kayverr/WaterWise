import express from "express";

import {
  getAllPermissions,
  getPermission,
} from "/controllers/permissionController.js";

import {
  authenticateUser,
} from "/middleware/authenticateUser.js";

import {
  validatePermission,
} from "/middleware/validatePermission.js";


const router = express.Router();


/**
 * Get all permissions
 */
router.get(
  "/",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  getAllPermissions
);


/**
 * Get permission by id
 */
router.get(
  "/:id",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  getPermission
);


export default router;