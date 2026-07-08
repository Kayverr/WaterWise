import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  loginUser,
  clearSession,
} from "/services/AuthService.js";

describe("Login Service", () => {

  beforeEach(() => {

    clearSession();

  });

  it("It should login successfully using valid credentials.", async () => {

    // Arrange

    const credentials = {
      email: "admin@gmail.com",
      password: "password123",
    };

    // Act

    const result =
      await loginUser(credentials);

    // Assert

    expect(result.message)
      .toBe("Login successful.");

    expect(result.user.email)
      .toBe("admin@gmail.com");

    expect(result.user.role)
      .toBe("Admin");

    expect(result.user.isAuthenticated)
      .toBe(true);

  });

  it("It should throw an error for an invalid email.", async () => {

    // Arrange

    const credentials = {
      email: "unknown@gmail.com",
      password: "password123",
    };

    // Act & Assert

    await expect(
      loginUser(credentials)
    ).rejects.toThrow(
      "Invalid email or password."
    );

  });

  it("It should throw an error for an invalid password.", async () => {

    // Arrange

    const credentials = {
      email: "admin@gmail.com",
      password: "wrongpassword",
    };

    // Act & Assert

    await expect(
      loginUser(credentials)
    ).rejects.toThrow(
      "Invalid email or password."
    );

  });

});