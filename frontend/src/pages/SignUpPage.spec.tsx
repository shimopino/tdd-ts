import { render, screen } from "@testing-library/react";
import { it } from "vitest";
import { SignUpPage } from "./SignUpPage";

it("has header", () => {
  render(<SignUpPage />);
  const header = screen.getByRole("heading", { name: "Sign Up" });
  expect(header).toBeInTheDocument();
});
