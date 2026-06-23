import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TextField from "../components/TextField";

describe("TextField", () => {
  it("should render input field", () => {
    // Arrange
    render(<TextField placeholder="Username" />);

    // Act
    const input = screen.getByPlaceholderText("Username");

    // Assert
    expect(input).toBeInTheDocument();
  });

  it("should accept user input", () => {
    // Arrange
    const handleChange = vi.fn();

    render(
      <TextField
        placeholder="Username"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Username");

    // Act
    fireEvent.change(input, {
      target: { value: "admin" },
    });

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});