import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { SignUpPage } from "./SignUpPage";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.getByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
  });
});
