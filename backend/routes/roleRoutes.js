import express from "express";

import {
  getAllRoles,
  getRole,
  addRole,
  updateRoleData,
  removeRole,
  assignPermissions,
  getRolePermissionList,
} from "/controllers/roleController.js";

import {
  authenticateUser,
} from "/middleware/authenticateUser.js";

import {
  validatePermission,
} from "/middleware/validatePermission.js";


const router = express.Router();


/**
 * Get all roles
 */
router.get(
  "/",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  getAllRoles
);


/**
 * Get role by id
 */
router.get(
  "/:id",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  getRole
);


/**
 * Create role
 */
router.post(
  "/",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  addRole
);


/**
 * Update role
 */
router.put(
  "/:id",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  updateRoleData
);


/**
 * Delete role
 */
router.delete(
  "/:id",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  removeRole
);


/**
 * Assign permissions to role
 */
router.put(
  "/:id/permissions",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  assignPermissions
);


/**
 * Get role permissions
 */
router.get(
  "/:id/permissions",
  authenticateUser,
  validatePermission(
    "role.manage"
  ),
  getRolePermissionList
);


export default router;