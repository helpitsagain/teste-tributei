import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BulkActionModal from "../components/BulkActionModal/BulkActionModal";
import { ToDo } from "../types/toDo";

describe("BulkActionModal", () => {
  const toDos: ToDo[] = Array.from({ length: 7 }).map((_, i) => ({
    id: String(i + 1),
    title: `Item ${i + 1}`,
    description: `desc ${i + 1}`,
    completed: false,
  }));

  it("shows preview and more count", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3", "4", "5", "6", "7"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText("Preview:")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("...and 2 more")).toBeInTheDocument();
  });

  it("confirms complete action and calls onConfirm + onCancel", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Completed/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Confirm$/i));

    expect(onConfirm).toHaveBeenCalledWith({ completed: true });
    expect(onCancel).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("confirms delete action and calls onDelete", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Delete items/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Confirm$/i));

    expect(onDelete).toHaveBeenCalledWith(["1", "2"]);
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
