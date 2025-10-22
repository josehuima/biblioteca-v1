import { render } from "@testing-library/react";
import AuthFormSkeleton from "../authform-skeleton"; // Adjust import path as needed
import React from "react";
import { describe, expect, it } from "vitest";
describe("AuthFormSkeleton", () => {
  it("renders correctly for signup", () => {
    const { container } = render(<AuthFormSkeleton type="signup" />);

    // Check if the first section is rendered
    expect(container.querySelector("section")).toBeInTheDocument();

    // Adjusted selector to match a height class with `h-`
    expect(container.querySelector('div[class*="h-"]')).toBeInTheDocument();

    // Additional checks for specific elements
    expect(container.querySelector('div[class*="bg-"]')).toBeInTheDocument(); // Check for background color
  });

  it("renders correctly for signin", () => {
    const { container } = render(<AuthFormSkeleton type="signin" />);

    // Check if the first section is rendered
    expect(container.querySelector("section")).toBeInTheDocument();

    // Adjusted selector to match a height class with `h-`
    expect(container.querySelector('div[class*="h-"]')).toBeInTheDocument();

    // Additional checks for specific elements
    expect(container.querySelector('div[class*="bg-"]')).toBeInTheDocument(); // Check for background color
  });
});
