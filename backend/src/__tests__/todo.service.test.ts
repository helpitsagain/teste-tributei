import { describe, it, expect, beforeEach, vi } from "vitest";
import * as sql from "../repositories/sql.js";
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

  it("returns paginated todos", async () => {
    vi.spyOn(sql, "getToDosPaginated").mockResolvedValue({
      toDos: sampleToDos.slice(0, 2),
      total: 3,
      page: 1,
      totalPages: Math.ceil(3 / 2),
    });

    const res = await service.getToDosPaginated(1, 2);

    expect(res.page).toBe(1);
    expect(res.toDos).toHaveLength(2);
    expect(res.total).toBe(3);
    expect(res.totalPages).toBe(Math.ceil(3 / 2));
  });

  it("creates a new todo", async () => {
    const created = {
      id: "new-id",
      title: "New",
      description: "desc",
      completed: false,
    };
    const createSpy = vi
      .spyOn(sql, "createToDo")
      .mockResolvedValue(created as any);

    const newToDo = await service.createToDo("New", "desc");

    expect(newToDo).toHaveProperty("id");
    expect(newToDo.title).toBe("New");
    expect(createSpy).toHaveBeenCalledWith("New", "desc");
  });

  it("updates an existing todo", async () => {
    const updatedObj = {
      id: "2",
      title: "B-updated",
      description: "b",
      completed: true,
    };
    const updateSpy = vi
      .spyOn(sql, "updateToDo")
      .mockResolvedValue(updatedObj as any);

    const updated = await service.updateToDo("2", { title: "B-updated" });

    expect(updated).not.toBeNull();
    expect((updated as any).title).toBe("B-updated");
    expect(updateSpy).toHaveBeenCalledWith("2", { title: "B-updated" });
  });

  it("returns null when updating non-existent todo", async () => {
    vi.spyOn(sql, "updateToDo").mockResolvedValue(null);

    const updated = await service.updateToDo("zzz", { title: "no" });

    expect(updated).toBeNull();
  });

  it("deletes a todo", async () => {
    const deletedObj = {
      id: "1",
      title: "A",
      description: "a",
      completed: false,
    };
    const deleteSpy = vi
      .spyOn(sql, "deleteToDo")
      .mockResolvedValue(deletedObj as any);

    const removed = await service.deleteToDo("1");

    expect(removed).not.toBeNull();
    expect((removed as any).id).toBe("1");
    expect(deleteSpy).toHaveBeenCalledWith("1");
  });

  it("bulk updates todos", async () => {
    const updatedArr = [
      { id: "1", title: "A", description: "a", completed: true },
      { id: "3", title: "C", description: "c", completed: true },
    ];
    const bulkUpdateSpy = vi
      .spyOn(sql, "bulkUpdateToDos")
      .mockResolvedValue(updatedArr as any);

    const updated = await service.bulkUpdateToDos(["1", "3"], {
      completed: true,
    });

    expect(updated).toHaveLength(2);
    expect(updated.every((t) => t.completed)).toBeTruthy();
    expect(bulkUpdateSpy).toHaveBeenCalledWith(["1", "3"], { completed: true });
  });

  it("bulk deletes todos", async () => {
    const deletedArr = [
      { id: "2", title: "B", description: "b", completed: true },
    ];
    const bulkDeleteSpy = vi
      .spyOn(sql, "bulkDeleteToDos")
      .mockResolvedValue(deletedArr as any);

    const deleted = await service.bulkDeleteToDos(["2"]);

    expect(deleted).toHaveLength(1);
    expect(deleted[0].id).toBe("2");
    expect(bulkDeleteSpy).toHaveBeenCalledWith(["2"]);
  });

  it("returns repository pagination result as-is", async () => {
    const paginated = {
      toDos: [
        { id: "1", title: "A", description: "a", completed: false },
        { id: "1", title: "A-dup", description: "a", completed: false },
      ],
      total: 3,
      page: 1,
      totalPages: 1,
    };
    vi.spyOn(sql, "getToDosPaginated").mockResolvedValue(paginated as any);

    const res = await service.getToDosPaginated(1, 10);

    expect(res.total).toBe(3);
    expect(res.toDos).toHaveLength(2);
  });

  it("createToDo returns created todo and calls repository", async () => {
    const created = {
      id: "new-2",
      title: "New2",
      description: "desc2",
      completed: false,
    };
    const createSpy = vi
      .spyOn(sql, "createToDo")
      .mockResolvedValue(created as any);

    const newToDo = await service.createToDo("New2", "desc2");

    expect(newToDo.title).toBe("New2");
    expect(createSpy).toHaveBeenCalledWith("New2", "desc2");
  });
});
