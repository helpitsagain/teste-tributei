import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TodoItem from "../components/ToDoList/ToDoItem";
import { ToDo } from "../types/toDo";

describe("TodoItem", () => {
  const todo: ToDo = {
    id: "1",
    title: "Test title",
    description: "Test description",
    completed: false,
  };

  it("renders title, description and status", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />,
    );

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  it("calls onSelect when checkbox changed or content clicked", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onSelect).toHaveBeenCalledWith("1");

    const content = screen.getByText("Test title");
    fireEvent.click(content);
    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("calls onUpdate when toggle status button clicked", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />,
    );

    const toggleBtn = screen.getByText(/Mark as Completed/i);
    fireEvent.click(toggleBtn);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updatedArg = onUpdate.mock.calls[0][0];
    expect(updatedArg.id).toBe("1");
    expect(updatedArg.completed).toBe(true);
  });

  it("enters edit mode and shows TodoItemEdit when Edit clicked", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />,
    );

    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);

    expect(screen.getByDisplayValue("Test title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
  });
});
