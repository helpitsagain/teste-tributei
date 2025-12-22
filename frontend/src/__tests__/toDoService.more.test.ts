import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import api from "../services/api";
import * as toDoServiceModule from "../services/toDoService";

vi.mock("../services/api", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("toDoService additional endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updateToDo calls api.put and returns data", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { id: "1", title: "x" } };
    (api.put as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.updateToDo("1", { title: "x" });

    expect(api.put).toHaveBeenCalledWith(`/item/1`, { title: "x" });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses filter endpoint when title filter is provided", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { title: "test" });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 10, title: "test" },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses filter endpoint when description filter is provided", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { description: "desc" });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 10, description: "desc" },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses filter endpoint when completed filter is provided", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { completed: true });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 10, completed: true },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses filter endpoint with completed=false", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { completed: false });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 10, completed: false },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses filter endpoint with multiple filters", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 5, { 
      title: "test", 
      description: "desc", 
      completed: true 
    });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 5, title: "test", description: "desc", completed: true },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses normal endpoint when filters object is empty", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, {});

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10 },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos uses normal endpoint when no filters provided", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10);

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10 },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos does not include null completed in params", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { completed: null });

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10 },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos includes sort params when provided", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, undefined, { sortBy: "title", sortOrder: "asc" });

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10, sortBy: "title", sortOrder: "asc" },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos includes sort params with filters", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, { title: "test" }, { sortBy: "created_date", sortOrder: "desc" });

    expect(api.get).toHaveBeenCalledWith("items/filter", {
      params: { page: 1, limit: 10, title: "test", sortBy: "created_date", sortOrder: "desc" },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("getToDos sorts by updated_date desc", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };
    (api.get as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10, {}, { sortBy: "updated_date", sortOrder: "desc" });

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10, sortBy: "updated_date", sortOrder: "desc" },
    });
    expect(res).toEqual(mockResponse.data);
  });

  it("bulkUpdateToDos calls api.put and returns data", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { updatedToDos: [] } };
    (api.put as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.bulkUpdateToDos(["1", "2"], { completed: true });

    expect(api.put).toHaveBeenCalledWith("/bulk", { ids: ["1", "2"], updates: { completed: true } });
    expect(res).toEqual(mockResponse.data);
  });

  it("createToDo calls api.post and returns data", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { id: "3", title: "new" } };
    (api.post as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.createToDo({ title: "new" });

    expect(api.post).toHaveBeenCalledWith("/item/new", { title: "new" });
    expect(res).toEqual(mockResponse.data);
  });

  it("deleteToDo calls api.delete and returns data", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { id: "3" } };
    (api.delete as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.deleteToDo("3");

    expect(api.delete).toHaveBeenCalledWith(`item/3`);
    expect(res).toEqual(mockResponse.data);
  });

  it("bulkDeleteToDos calls api.delete and returns data", async () => {
    const toDoService = await vi.importActual<typeof toDoServiceModule>("../services/toDoService");

    const mockResponse = { data: { deletedToDos: [] } };
    (api.delete as Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.bulkDeleteToDos(["1"]);

    expect(api.delete).toHaveBeenCalledWith("/bulk/delete", { data: { ids: ["1"] } });
    expect(res).toEqual(mockResponse.data);
  });
});
