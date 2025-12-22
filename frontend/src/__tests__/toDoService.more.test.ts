import { describe, it, expect, vi } from "vitest";
import api from "../services/api";

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
  it("updateToDo calls api.put and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { id: "1", title: "x" } };
    (api.put as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.updateToDo("1", { title: "x" });

    expect(api.put).toHaveBeenCalledWith(`/item/1`, { title: "x" });
    expect(res).toEqual(mockResponse.data);
  });

  it("bulkUpdateToDos calls api.put and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { updatedToDos: [] } };
    (api.put as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.bulkUpdateToDos(["1", "2"], { completed: true });

    expect(api.put).toHaveBeenCalledWith("/bulk", { ids: ["1", "2"], updates: { completed: true } });
    expect(res).toEqual(mockResponse.data);
  });

  it("createToDo calls api.post and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { id: "3", title: "new" } };
    (api.post as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.createToDo({ title: "new" });

    expect(api.post).toHaveBeenCalledWith("/item/new", { title: "new" });
    expect(res).toEqual(mockResponse.data);
  });

  it("deleteToDo calls api.delete and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { id: "3" } };
    (api.delete as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.deleteToDo("3");

    expect(api.delete).toHaveBeenCalledWith(`item/3`);
    expect(res).toEqual(mockResponse.data);
  });

  it("bulkDeleteToDos calls api.delete and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { deletedToDos: [] } };
    (api.delete as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.bulkDeleteToDos(["1"]);

    expect(api.delete).toHaveBeenCalledWith("/bulk/delete", { data: { ids: ["1"] } });
    expect(res).toEqual(mockResponse.data);
  });
});
