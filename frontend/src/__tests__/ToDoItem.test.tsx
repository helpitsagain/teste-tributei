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
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
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
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
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
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
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
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);

    expect(screen.getByDisplayValue("Test title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
  });

  it("renders completed status when todo is completed", () => {
    const completedTodo: ToDo = { ...todo, completed: true };
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText(/Mark as Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Completed/i)).toBeInTheDocument();
  });

  it("applies selected class when isSelected is true", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoItem
        todo={todo}
        isSelected={true}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    expect(container.querySelector(".todo-item--selected")).toBeInTheDocument();
  });

  it("checkbox is checked when isSelected is true", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={true}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("saves changes from edit mode and exits edit mode", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByText("Edit"));

    const titleInput = screen.getByDisplayValue("Test title");
    fireEvent.change(titleInput, { target: { value: "Updated title" } });

    fireEvent.click(screen.getByText("Save"));

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        title: "Updated title",
        description: "Test description",
      })
    );

    expect(screen.queryByDisplayValue("Updated title")).not.toBeInTheDocument();
  });

  it("cancels edit mode without saving changes", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByText("Edit"));

    const titleInput = screen.getByDisplayValue("Test title");
    fireEvent.change(titleInput, { target: { value: "Updated title" } });

    fireEvent.click(screen.getByText("Cancel"));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText("Test title")).toBeInTheDocument();
  });

  it("deletes item from edit mode", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText(/Delete item\?/i));

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("toggles edit mode when Edit button is clicked twice", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem
        todo={todo}
        isSelected={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByDisplayValue("Test title")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.queryByDisplayValue("Test title")).not.toBeInTheDocument();
    expect(screen.getByText("Test title")).toBeInTheDocument();
  });
});
