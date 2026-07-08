import { validateLogin } from "../validation/AuthValidation.js";

const mockUsers = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "password123",
    fullName: "System Administrator",
    role: "Admin",
  },
  {
    id: 2,
    email: "staff@gmail.com",
    password: "staff123",
    fullName: "Juan Dela Cruz",
    role: "Staff",
  },
];

let currentSession = null;

/**
 * Login User
 */
export const loginUser = async (credentials) => {

  validateLogin(credentials);

  const user = mockUsers.find(
    (user) =>
      user.email === credentials.email &&
      user.password === credentials.password
  );

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  currentSession = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isAuthenticated: true,
  };

  return {
    message: "Login successful.",
    user: currentSession,
  };

};

/**
 * Logout User
 */
export const logoutUser = async () => {

  if (!currentSession) {
    throw new Error(
      "No active session."
    );
  }

  currentSession = null;

  return {
    message: "Logout successful.",
  };

};

/**
 * Get Current User
 */
export const getCurrentUser = async () => {

  if (!currentSession) {
    throw new Error(
      "Unauthorized."
    );
  }

  return currentSession;

};

/**
 * Check Authentication
 */
export const isAuthenticated = () => {

  return currentSession !== null;

};

/**
 * Restore Session
 */
export const restoreSession = async () => {

  if (!currentSession) {
    return null;
  }

  return currentSession;

};

/**
 * Clear Session
 */
export const clearSession = () => {

  currentSession = null;

};

/**
 * Mock Session
 * (Used only for unit testing)
 */
export const setMockSession = (user) => {

  currentSession = user;

};