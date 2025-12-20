import { describe, it, expect, beforeEach, vi } from "vitest";
import * as model from "../models/todo.model.js";
import * as service from "../services/todo.service.js";

const sampleToDos = [
  { id: "1", title: "A", description: "a", completed: false },
  { id: "2", title: "B", description: "b", completed: true },
  { id: "3", title: "C", description: "c", completed: false },
];

describe("todo.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns paginated todos", () => {
    vi.spyOn(model, "getToDos").mockReturnValue([...sampleToDos]);

    const res = service.getToDosPaginated(1, 2);

    expect(res.page).toBe(1);
    expect(res.toDos).toHaveLength(2);
    expect(res.total).toBe(3);
    expect(res.totalPages).toBe(Math.ceil(3 / 2));
  });

  it("creates a new todo", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const newToDo = service.createToDo("New", "desc");

    expect(newToDo).toHaveProperty("id");
    expect(newToDo.title).toBe("New");
    expect(setSpy).toHaveBeenCalled();
  });

  it("updates an existing todo", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const updated = service.updateToDo("2", { title: "B-updated" });

    expect(updated).not.toBeNull();
    expect((updated as any).title).toBe("B-updated");
    expect(setSpy).toHaveBeenCalled();
  });

  it("returns null when updating non-existent todo", () => {
    vi.spyOn(model, "getToDos").mockReturnValue([...sampleToDos]);

    const updated = service.updateToDo("zzz", { title: "no" });

    expect(updated).toBeNull();
  });

  it("deletes a todo", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const removed = service.deleteToDo("1");

    expect(removed).not.toBeNull();
    expect((removed as any).id).toBe("1");
    expect(setSpy).toHaveBeenCalled();
  });

  it("bulk updates todos", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const updated = service.bulkUpdateToDos(["1", "3"], { completed: true });

    expect(updated).toHaveLength(2);
    expect(updated.every((t) => t.completed)).toBeTruthy();
    expect(setSpy).toHaveBeenCalled();
  });

  it("bulk deletes todos", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const deleted = service.bulkDeleteToDos(["2"]);

    expect(deleted).toHaveLength(1);
    expect(deleted[0].id).toBe("2");
    expect(setSpy).toHaveBeenCalled();
  });

  it("removes duplicate ids when paginating", () => {
    const dup = [
      { id: "1", title: "A", description: "a", completed: false },
      { id: "1", title: "A-dup", description: "a", completed: false },
      { id: "2", title: "B", description: "b", completed: true },
    ];

    vi.spyOn(model, "getToDos").mockReturnValue(dup);

    const res = service.getToDosPaginated(1, 10);

    expect(res.total).toBe(3); 
    expect(res.toDos).toHaveLength(2);
  });

  it("createToDo persists array including new todo (setToDos payload)", () => {
    const arr = [...sampleToDos];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    const setSpy = vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const originalLength = arr.length;
    const newToDo = service.createToDo("New2", "desc2");

    expect(newToDo.title).toBe("New2");
    const passedArray = setSpy.mock.calls[0][0];
    expect(passedArray).toHaveLength(originalLength + 1);
    expect(passedArray.find((t: any) => t.title === "New2")).toBeTruthy();
  });
});
