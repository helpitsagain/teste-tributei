// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("./services/toDoService", () => {
  return {
    // default: lista vazia
    getToDos: vi.fn().mockResolvedValue({ toDos: [], page: 1, totalPages: 1 }),
    updateToDo: vi.fn().mockResolvedValue({}),
    bulkUpdateToDos: vi.fn().mockResolvedValue({}),
    bulkDeleteToDos: vi.fn().mockResolvedValue({}),
    createToDo: vi.fn().mockResolvedValue({}),
    deleteToDo: vi.fn().mockResolvedValue({}),
  };
});
