import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookCard from "../BookCard";

// Mock imagekitio-next to include ImageKitProvider and IKImage
vi.mock("imagekitio-next", () => ({
  ImageKitProvider: ({ children }: any) => <div>{children}</div>,
  IKImage: (props: any) => <img {...props} />,
}));

describe("BookCard", () => {
  it("renders correctly with given props", () => {
    const { getByText } = render(<BookCard title="Test Book" author="Test Author" genre="Fiction" rating={4} cover="test-cover.jpg" />);

    expect(getByText("Test Book")).toBeInTheDocument();
    expect(getByText("Test Author")).toBeInTheDocument();
  });
});
