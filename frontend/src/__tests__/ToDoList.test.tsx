import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TodoList from "../components/ToDoList/ToDoList";
import * as toDoService from "../services/toDoService";
import { ToDo } from "../types/toDo";

vi.mock("../services/toDoService");

describe("TodoList", () => {
  const mockToDos: ToDo[] = [
    { id: "1", title: "A", description: "desc A", completed: false },
    { id: "2", title: "B", description: "desc B", completed: true },
  ];

  beforeEach(() => {
    const mockedService = vi.mocked(toDoService);
    mockedService.getToDos.mockResolvedValue({
      toDos: mockToDos,
      page: 1,
      totalPages: 1,
    });
    mockedService.bulkUpdateToDos.mockResolvedValue({});
    mockedService.bulkDeleteToDos.mockResolvedValue({});
    mockedService.createToDo.mockResolvedValue({});
    mockedService.updateToDo.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays todos from service", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });

  it("selects all todos when Select All clicked", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);

    expect(screen.getByText(/Deselect All/i)).toBeInTheDocument();
  });

  it("disables Bulk Actions when nothing selected", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    const bulkBtn = screen.getByText("Bulk Actions") as HTMLButtonElement;
    expect(bulkBtn).toBeDisabled();
  });
});
