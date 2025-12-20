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

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} />);

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

    render(<TodoItemEdit todo={todo} onSave={onSave} onCancel={onCancel} />);

    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });
});
