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

describe("toDoService", () => {
  it("getToDos calls api.get and returns data", async () => {
    const toDoService = await vi.importActual("../services/toDoService");

    const mockResponse = { data: { toDos: [], page: 1, totalPages: 1 } };

    (api.get as unknown as vi.Mock).mockResolvedValueOnce(mockResponse);

    const res = await toDoService.getToDos(1, 10);

    expect(api.get).toHaveBeenCalledWith("items", {
      params: { page: 1, limit: 10 },
    });
    expect(res).toEqual(mockResponse.data);
  });
});
