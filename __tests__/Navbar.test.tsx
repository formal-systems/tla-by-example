import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar, { CODESPACES_URL } from "@/components/Navbar";

jest.mock("next/link", () => {
  return ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe("Navbar", () => {
  it("links to GitHub Codespaces when showCodespaces is set", () => {
    render(<Navbar breadcrumbs={[{ label: "Lesson" }]} showCodespaces />);
    const link = screen.getByRole("link", { name: "Open in VS Code" });
    expect(link).toHaveAttribute("href", CODESPACES_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("omits the Codespaces link by default", () => {
    render(<Navbar breadcrumbs={[{ label: "Lesson" }]} />);
    expect(screen.queryByRole("link", { name: "Open in VS Code" })).not.toBeInTheDocument();
  });
});
