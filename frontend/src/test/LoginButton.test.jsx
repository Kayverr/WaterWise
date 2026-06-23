import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginButton from "../components/LoginButton";

describe("LoginButton", () => {
  it("should render login button", () => {
    // Arrange
    render(<LoginButton />);

    // Act
    const button = screen.getByRole("button", {
      name: /login/i,
    });

    // Assert
    expect(button).toBeInTheDocument();
  });

  it("should display the text Login", () => {
    // Arrange
    render(<LoginButton />);

    // Act
    const button = screen.getByRole("button", {
      name: /login/i,
    });

    // Assert
    expect(button).toHaveTextContent("Login");
  });

  it("should call onClick when clicked", () => {
    // Arrange
    const handleClick = vi.fn();

    render(<LoginButton onClick={handleClick} />);

    const button = screen.getByRole("button", {
      name: /login/i,
    });

    // Act
    fireEvent.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    // Arrange
    render(<LoginButton disabled />);

    // Act
    const button = screen.getByRole("button", {
      name: /login/i,
    });

    // Assert
    expect(button).toBeDisabled();
  });
});