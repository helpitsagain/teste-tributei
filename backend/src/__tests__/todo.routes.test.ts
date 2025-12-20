import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import app from "../app.js";
import * as model from "../models/todo.model.js";

const sampleToDos = [
  { id: "1", title: "A", description: "a", completed: false },
];

describe("todo.routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/items returns paginated data", async () => {
    vi.spyOn(model, "getToDos").mockReturnValue([...sampleToDos]);

    const res = await request(app).get("/api/items");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("toDos");
    expect(res.body.toDos).toHaveLength(1);
  });

  it("POST /api/item/new creates a todo", async () => {
    vi.spyOn(model, "getToDos").mockReturnValue([]);
    vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const res = await request(app)
      .post("/api/item/new")
      .send({ title: "T", description: "D" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("newToDo");
    expect(res.body.newToDo.title).toBe("T");
  });

  it("PUT /api/item/:id returns 404 for not found", async () => {
    vi.spyOn(model, "getToDos").mockReturnValue([]);

    const res = await request(app)
      .put("/api/item/unknown")
      .send({ title: "x" });

    expect(res.status).toBe(404);
  });

  it("PUT /api/item/:id updates and returns the todo", async () => {
    const arr = [{ id: "1", title: "A", description: "a", completed: false }];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const res = await request(app)
      .put("/api/item/1")
      .send({ title: "A-updated" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body.title).toBe("A-updated");
  });

  it("DELETE /api/item/:id deletes and returns the todo", async () => {
    const arr = [
      { id: "1", title: "A", description: "a", completed: false },
      { id: "2", title: "B", description: "b", completed: false },
    ];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const res = await request(app).delete("/api/item/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe("1");
  });

  it("DELETE /api/item/:id returns 404 when not found", async () => {
    vi.spyOn(model, "getToDos").mockReturnValue([]);

    const res = await request(app).delete("/api/item/unknown");

    expect(res.status).toBe(404);
  });

  it("POST /api/item/new returns 400 when title missing", async () => {
    vi.spyOn(model, "getToDos").mockReturnValue([]);

    const res = await request(app)
      .post("/api/item/new")
      .send({ description: "no title" });

    expect(res.status).toBe(400);
  });

  it("PUT /api/bulk returns 400 when ids is not array", async () => {
    const arr = [{ id: "1", title: "A", description: "a", completed: false }];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);

    const res = await request(app)
      .put("/api/bulk")
      .send({ ids: "not-an-array", updates: { completed: true } });

    expect(res.status).toBe(400);
  });

  it("DELETE /api/bulk/delete returns 400 when ids empty", async () => {
    const arr = [{ id: "1", title: "A", description: "a", completed: false }];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);

    const res = await request(app).delete("/api/bulk/delete").send({ ids: [] });

    expect(res.status).toBe(400);
  });

  it("GET / returns root message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/API funcionando/i);
  });

  it("GET /swagger.json returns JSON swagger spec", async () => {
    const res = await request(app).get("/swagger.json");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(typeof res.body).toBe("object");
  });

  it("PUT /api/bulk updates multiple todos", async () => {
    const arr = [
      { id: "1", title: "A", description: "a", completed: false },
      { id: "2", title: "B", description: "b", completed: false },
    ];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const res = await request(app)
      .put("/api/bulk")
      .send({ ids: ["1", "2"], updates: { completed: true } });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updatedTodos");
    expect(res.body.updatedTodos).toHaveLength(2);
    expect(res.body.updatedTodos.every((t: any) => t.completed)).toBeTruthy();
  });

  it("DELETE /api/bulk/delete removes multiple todos", async () => {
    const arr = [
      { id: "1", title: "A", description: "a", completed: false },
      { id: "2", title: "B", description: "b", completed: false },
    ];
    vi.spyOn(model, "getToDos").mockReturnValue(arr);
    vi.spyOn(model, "setToDos").mockImplementation(() => {});

    const res = await request(app)
      .delete("/api/bulk/delete")
      .send({ ids: ["2"] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updatedTodos");
    expect(res.body.updatedTodos).toHaveLength(1);
    expect(res.body.updatedTodos[0].id).toBe("2");
  });
});
