import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import TodoItemEdit from "../components/ToDoList/ToDoItemEdit";
import { ToDo } from "../types/toDo";

describe("TodoItemEdit", () => {
  const todo: ToDo = {
    id: "1",
    title: "Initial",
    description: "Initial desc",
    completed: false,
  };

  it("renders inputs with initial values and calls onSave with updated values", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />);

    const titleInput = screen.getByDisplayValue("Initial") as HTMLInputElement;
    const descInput = screen.getByDisplayValue(
      "Initial desc",
    ) as HTMLTextAreaElement;

    expect(titleInput.value).toBe("Initial");
    expect(descInput.value).toBe("Initial desc");

    fireEvent.change(titleInput, { target: { value: "Updated" } });
    fireEvent.change(descInput, { target: { value: "Updated desc" } });

    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledTimes(1);
    const savedArg = onSave.mock.calls[0][0];
    expect(savedArg.title).toBe("Updated");
    expect(savedArg.description).toBe("Updated desc");
  });

  it("calls onCancel when Cancel clicked", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />);

    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows confirmation when Delete is clicked", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />);

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/Delete item\?/i)).toBeInTheDocument();
    expect(screen.getByText(/This cannot be undone/i)).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />);

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByText(/Delete item\?/i);
    fireEvent.click(confirmBtn);

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("toggles confirmation state when Delete clicked multiple times", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />);

    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/Delete item\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Delete item\?/i));

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
