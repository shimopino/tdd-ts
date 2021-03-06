import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { SignUpPage } from "./SignUpPage";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.getByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText(
        "Password Repeat"
      ) as HTMLInputElement;
      expect(input.type).toBe("password");
    });

    it("has Sign up Button", () => {
      render(<SignUpPage />);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });

    it("disables the button initially", () => {
      render(<SignUpPage />);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interaction", () => {
    it("enables the button when password and password repeat fields have same value", () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");

      userEvent.type(passwordInput, "P@ssword");
      userEvent.type(passwordRepeatInput, "P@ssword");

      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeEnabled();
    });
  });
});
