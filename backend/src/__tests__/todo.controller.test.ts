import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { Request, Response } from "express";
import * as controller from "../controllers/todo.controller.js";
import * as service from "../services/todo.service.js";

vi.mock("../services/todo.service.js");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res as Response;
};

const mockRequest = (options: {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: any;
}) => {
  return {
    params: options.params || {},
    query: options.query || {},
    body: options.body || {},
  } as Request;
};

describe("todo.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getToDos", () => {
    it("returns paginated todos with default params", async () => {
      const mockResult = {
        toDos: [{ id: "1", title: "A", description: "a", completed: false }],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      (service.getToDosPaginated as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await controller.getToDos(req, res);

      expect(service.getToDosPaginated).toHaveBeenCalledWith(1, 20, undefined, "updated_date", "desc");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult });
    });

    it("returns paginated todos with custom page and limit", async () => {
      const mockResult = {
        toDos: [],
        total: 0,
        page: 2,
        totalPages: 0,
      };
      (service.getToDosPaginated as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: { page: "2", limit: "5" } });
      const res = mockResponse();

      await controller.getToDos(req, res);

      expect(service.getToDosPaginated).toHaveBeenCalledWith(2, 5, undefined, "updated_date", "desc");
    });

    it("returns paginated todos with completed=true filter", async () => {
      const mockResult = {
        toDos: [{ id: "1", title: "A", description: "a", completed: true }],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      (service.getToDosPaginated as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: { completed: "true" } });
      const res = mockResponse();

      await controller.getToDos(req, res);

      expect(service.getToDosPaginated).toHaveBeenCalledWith(1, 20, true, "updated_date", "desc");
    });

    it("returns paginated todos with completed=false filter", async () => {
      const mockResult = {
        toDos: [{ id: "1", title: "A", description: "a", completed: false }],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      (service.getToDosPaginated as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: { completed: "false" } });
      const res = mockResponse();

      await controller.getToDos(req, res);

      expect(service.getToDosPaginated).toHaveBeenCalledWith(1, 20, false, "updated_date", "desc");
    });

    it("returns 500 on service error", async () => {
      (service.getToDosPaginated as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await controller.getToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });
      consoleSpy.mockRestore();
    });
  });

  describe("getToDosFiltered", () => {
    it("returns filtered todos with all filters", async () => {
      const mockResult = {
        toDos: [{ id: "1", title: "Test", description: "desc", completed: true }],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      (service.getToDosFiltered as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({
        query: {
          page: "1",
          limit: "10",
          title: "Test",
          description: "desc",
          completed: "true",
        },
      });
      const res = mockResponse();

      await controller.getToDosFiltered(req, res);

      expect(service.getToDosFiltered).toHaveBeenCalledWith(1, 10, {
        title: "Test",
        description: "desc",
        completed: true,
      }, "updated_date", "desc");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult });
    });

    it("returns filtered todos with only title filter", async () => {
      const mockResult = { toDos: [], total: 0, page: 1, totalPages: 0 };
      (service.getToDosFiltered as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: { title: "Search" } });
      const res = mockResponse();

      await controller.getToDosFiltered(req, res);

      expect(service.getToDosFiltered).toHaveBeenCalledWith(1, 20, { title: "Search" }, "updated_date", "desc");
    });

    it("returns filtered todos with only description filter", async () => {
      const mockResult = { toDos: [], total: 0, page: 1, totalPages: 0 };
      (service.getToDosFiltered as Mock).mockResolvedValue(mockResult);

      const req = mockRequest({ query: { description: "search" } });
      const res = mockResponse();

      await controller.getToDosFiltered(req, res);

      expect(service.getToDosFiltered).toHaveBeenCalledWith(1, 20, { description: "search" }, "updated_date", "desc");
    });

    it("returns 500 on service error", async () => {
      (service.getToDosFiltered as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await controller.getToDosFiltered(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe("createToDo", () => {
    it("creates a new todo successfully", async () => {
      const newToDo = { id: "new", title: "New", description: "desc", completed: false };
      (service.createToDo as Mock).mockResolvedValue(newToDo);

      const req = mockRequest({ body: { title: "New", description: "desc" } });
      const res = mockResponse();

      await controller.createToDo(req, res);

      expect(service.createToDo).toHaveBeenCalledWith("New", "desc");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: newToDo });
    });

    it("creates todo with empty description", async () => {
      const newToDo = { id: "new", title: "New", description: undefined, completed: false };
      (service.createToDo as Mock).mockResolvedValue(newToDo);

      const req = mockRequest({ body: { title: "New" } });
      const res = mockResponse();

      await controller.createToDo(req, res);

      expect(service.createToDo).toHaveBeenCalledWith("New", undefined);
    });

    it("returns 400 when title is missing", async () => {
      const req = mockRequest({ body: { description: "desc" } });
      const res = mockResponse();

      await controller.createToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Title is required." });
    });

    it("returns 400 when title is empty string", async () => {
      const req = mockRequest({ body: { title: "", description: "desc" } });
      const res = mockResponse();

      await controller.createToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 on service error", async () => {
      (service.createToDo as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ body: { title: "New" } });
      const res = mockResponse();

      await controller.createToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe("updateToDo", () => {
    it("updates a todo successfully", async () => {
      const updatedToDo = { id: "1", title: "Updated", description: "desc", completed: false };
      (service.updateToDo as Mock).mockResolvedValue(updatedToDo);

      const req = mockRequest({
        params: { id: "1" },
        body: { title: "Updated" },
      });
      const res = mockResponse();

      await controller.updateToDo(req, res);

      expect(service.updateToDo).toHaveBeenCalledWith("1", { title: "Updated" });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedToDo });
    });

    it("returns 404 when todo not found", async () => {
      (service.updateToDo as Mock).mockResolvedValue(null);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({
        params: { id: "non-existent" },
        body: { title: "Updated" },
      });
      const res = mockResponse();

      await controller.updateToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "ID 'non-existent' not found." });
      consoleSpy.mockRestore();
    });

    it("returns 500 on service error", async () => {
      (service.updateToDo as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({
        params: { id: "1" },
        body: { title: "Updated" },
      });
      const res = mockResponse();

      await controller.updateToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe("deleteToDo", () => {
    it("deletes a todo successfully", async () => {
      const deletedToDo = { id: "1", title: "A", description: "a", completed: false };
      (service.deleteToDo as Mock).mockResolvedValue(deletedToDo);

      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await controller.deleteToDo(req, res);

      expect(service.deleteToDo).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: deletedToDo });
    });

    it("returns 404 when todo not found", async () => {
      (service.deleteToDo as Mock).mockResolvedValue(null);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ params: { id: "non-existent" } });
      const res = mockResponse();

      await controller.deleteToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "To-do not found.",
      });
      consoleSpy.mockRestore();
    });

    it("returns 500 on service error", async () => {
      (service.deleteToDo as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ params: { id: "1" } });
      const res = mockResponse();

      await controller.deleteToDo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe("bulkUpdateToDos", () => {
    it("updates multiple todos successfully", async () => {
      const updatedToDos = [
        { id: "1", title: "A", description: "a", completed: true },
        { id: "2", title: "B", description: "b", completed: true },
      ];
      (service.bulkUpdateToDos as Mock).mockResolvedValue(updatedToDos);

      const req = mockRequest({
        body: { ids: ["1", "2"], updates: { completed: true } },
      });
      const res = mockResponse();

      await controller.bulkUpdateToDos(req, res);

      expect(service.bulkUpdateToDos).toHaveBeenCalledWith(["1", "2"], { completed: true });
      expect(res.json).toHaveBeenCalledWith({ updatedTodos: updatedToDos });
    });

    it("returns 400 when ids is not an array", async () => {
      const req = mockRequest({
        body: { ids: "not-array", updates: { completed: true } },
      });
      const res = mockResponse();

      await controller.bulkUpdateToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ids must be an array and updates must be provided",
      });
    });

    it("returns 400 when ids is undefined", async () => {
      const req = mockRequest({
        body: { updates: { completed: true } },
      });
      const res = mockResponse();

      await controller.bulkUpdateToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 on service error", async () => {
      (service.bulkUpdateToDos as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({
        body: { ids: ["1"], updates: { completed: true } },
      });
      const res = mockResponse();

      await controller.bulkUpdateToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe("bulkDeleteToDos", () => {
    it("deletes multiple todos successfully", async () => {
      const deletedToDos = [
        { id: "1", title: "A", description: "a", completed: false },
        { id: "2", title: "B", description: "b", completed: true },
      ];
      (service.bulkDeleteToDos as Mock).mockResolvedValue(deletedToDos);

      const req = mockRequest({ body: { ids: ["1", "2"] } });
      const res = mockResponse();

      await controller.bulkDeleteToDos(req, res);

      expect(service.bulkDeleteToDos).toHaveBeenCalledWith(["1", "2"]);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: deletedToDos });
    });

    it("returns 400 when ids is not an array", async () => {
      const req = mockRequest({ body: { ids: "not-array" } });
      const res = mockResponse();

      await controller.bulkDeleteToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ids must be an array and must be provided",
      });
    });

    it("returns 400 when ids is empty array", async () => {
      const req = mockRequest({ body: { ids: [] } });
      const res = mockResponse();

      await controller.bulkDeleteToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when ids is undefined", async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await controller.bulkDeleteToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 on service error", async () => {
      (service.bulkDeleteToDos as Mock).mockRejectedValue(new Error("fail"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = mockRequest({ body: { ids: ["1"] } });
      const res = mockResponse();

      await controller.bulkDeleteToDos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });
});
