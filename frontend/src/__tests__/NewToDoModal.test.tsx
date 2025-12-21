import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewToDoModal from "../components/NewToDoModal/NewToDoModal";

describe("NewToDoModal", () => {
  it("calls onConfirm with title and description", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { getAllByRole } = render(
      <NewToDoModal onConfirm={onConfirm} onCancel={onCancel} />,
    );

    const textboxes = getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "New title" } });
    fireEvent.change(textboxes[1], { target: { value: "A desc" } });

    fireEvent.click(screen.getByRole("button", { name: /^Create$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Confirm$/i }));

    expect(onConfirm).toHaveBeenCalledWith({ title: "New title", description: "A desc" });
  });

  it("renders error when provided", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(<NewToDoModal onConfirm={onConfirm} onCancel={onCancel} error={'boom'} />);

    expect(screen.getByText(/boom/)).toBeInTheDocument();
  });
});
