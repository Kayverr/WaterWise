import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginForm from "../components/LoginForm";

describe("LoginForm", () => {
  it("should login successfully when username and password are correct", () => {
    // Arrange
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    // Act
    fireEvent.change(usernameInput, {
      target: { value: "admin" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "admin123" },
    });

    fireEvent.click(loginButton);

    // Assert
    expect(
      screen.getByText("Login Successful")
    ).toBeInTheDocument();
  });

  it("should show error when only username is entered", () => {
    // Arrange
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    // Act
    fireEvent.change(usernameInput, {
      target: { value: "admin" },
    });

    fireEvent.click(loginButton);

    // Assert
    expect(
      screen.getByText("Password is required")
    ).toBeInTheDocument();
  });

  it("should show error when only password is entered", () => {
    // Arrange
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    // Act
    fireEvent.change(passwordInput, {
      target: { value: "admin123" },
    });

    fireEvent.click(loginButton);

    // Assert
    expect(
      screen.getByText("Username is required")
    ).toBeInTheDocument();
  });

  it("should show error when username and password are incorrect", () => {
    // Arrange
    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    // Act
    fireEvent.change(usernameInput, {
      target: { value: "wronguser" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "wrongpass" },
    });

    fireEvent.click(loginButton);

    // Assert
    expect(
      screen.getByText("Invalid username or password")
    ).toBeInTheDocument();
  });
});