import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "../components/ToDoList/ToDoList";
import * as toDoService from "../services/toDoService";
import { ToDo } from "../types/toDo";

vi.mock("../services/toDoService");
const mockedService = vi.mocked(toDoService);

describe("TodoList interactions", () => {
  const mockToDos: ToDo[] = [
    { id: "1", title: "A", description: "desc A", completed: false },
    { id: "2", title: "B", description: "desc B", completed: false },
  ];

  beforeEach(() => {
    mockedService.getToDos.mockResolvedValue({
      success: true,
      data: {
        toDos: mockToDos,
        total: mockToDos.length,
        page: 1,
        totalPages: 1,
      },
    });

    mockedService.bulkUpdateToDos.mockResolvedValue({ updatedToDos: [] });
    mockedService.bulkDeleteToDos.mockResolvedValue({ deletedToDos: [] });
    mockedService.createToDo.mockResolvedValue({ id: "3", title: "C", description: "desc C", completed: false });
    mockedService.updateToDo.mockResolvedValue({ id: "1", title: "A", description: "desc A", completed: true });
    mockedService.deleteToDo.mockResolvedValue({ id: "1", title: "A", description: "desc A", completed: false });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows error and retries when getToDos fails", async () => {
    mockedService.getToDos
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ success: true, data: { toDos: [], total: 0, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await waitFor(() => expect(screen.getByText(/Error: boom/i)).toBeInTheDocument());

    const retryBtn = screen.getByRole("button", { name: /Retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => expect(toDoService.getToDos).toHaveBeenCalled());
  });

  it("performs bulk update and updates UI", async () => {
    render(<TodoList />);

    await waitFor(() => expect(toDoService.getToDos).toHaveBeenCalled());

    await waitFor(() => expect(screen.queryByText("A")).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Select All/i));

    const bulkBtn = screen.getByText("Bulk Actions") as HTMLButtonElement;
    expect(bulkBtn).not.toBeDisabled();
    fireEvent.click(bulkBtn);

    fireEvent.click(screen.getByText(/Mark all as Completed/i));
    fireEvent.click(screen.getByText(/Confirm$/i));

    await waitFor(() => expect(toDoService.bulkUpdateToDos).toHaveBeenCalledWith(["1", "2"], { completed: true }));

    await waitFor(() => expect(screen.getAllByText(/Status: Completed/i).length).toBeGreaterThanOrEqual(1));
  });

  it("opens create modal and calls createToDo", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByText(/Create new to-do/i));

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "New title" } });
    fireEvent.change(textboxes[1], { target: { value: "New desc" } });

    fireEvent.click(screen.getByRole("button", { name: /^Create$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Confirm$/i }));

    await waitFor(() => expect(toDoService.createToDo).toHaveBeenCalledWith({ title: "New title", description: "New desc" }));
  });

  it("updates a todo via item toggle and calls updateToDo", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    const toggleButtons = screen.getAllByText(/Mark as Completed|Mark as Pending/i);
    fireEvent.click(toggleButtons[0]);

    await waitFor(() => expect(toDoService.updateToDo).toHaveBeenCalled());
  });

  it("shows bulk delete error when service fails", async () => {
    mockedService.bulkDeleteToDos.mockRejectedValueOnce({ response: { data: { error: "del-failed" } } });

    render(<TodoList />);

    await waitFor(() => expect(toDoService.getToDos).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("A")).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Select All/i));
    fireEvent.click(screen.getByText("Bulk Actions"));

    fireEvent.click(screen.getByText(/Delete items/i));
    fireEvent.click(screen.getByText(/Confirm$/i));

    await waitFor(() => expect(toDoService.bulkDeleteToDos).toHaveBeenCalled());

    expect(screen.getByText(/Deselect All/i)).toBeInTheDocument();
  });

  it("loads next page when scrolling near bottom", async () => {
    const page1 = [ { id: "1", title: "P1-1", description: "", completed: false } ];
    const page2 = [ { id: "2", title: "P2-1", description: "", completed: false } ];

    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: page1, total: 2, page: 1, totalPages: 2 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: page2, total: 2, page: 2, totalPages: 2 } });

    render(<TodoList />);

    await waitFor(() => expect(mockedService.getToDos).toHaveBeenCalledTimes(1));

    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'offsetHeight', { value: 1500, configurable: true });

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => expect(mockedService.getToDos.mock.calls.length).toBeGreaterThanOrEqual(2));
  });

  it("shows createToDo error in modal when creation fails", async () => {
    mockedService.createToDo.mockRejectedValueOnce({ response: { data: { error: "create-failed" } } });

    render(<TodoList />);

    await waitFor(() => expect(toDoService.getToDos).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/Create new to-do/i));

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "New title" } });
    fireEvent.change(textboxes[1], { target: { value: "New desc" } });

    fireEvent.click(screen.getByRole("button", { name: /^Create$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Confirm$/i }));

    await waitFor(() => expect(toDoService.createToDo).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/create-failed/i)).toBeInTheDocument());
  });

  it("opens filters modal and applies filters", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    await waitFor(() => expect(screen.getByText("Filters", { selector: "h2" })).toBeInTheDocument());

    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "Test" } });

    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, { title: "Test" }, undefined);
    });
  });

  it("clears filters when Clear filters button is clicked", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    await waitFor(() => expect(screen.getByText("Filters", { selector: "h2" })).toBeInTheDocument());

    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalled();
    });
  });

  it("cancels filters modal without applying", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    await waitFor(() => expect(screen.getByText("Filters", { selector: "h2" })).toBeInTheDocument());

    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "Test" } });

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => expect(screen.queryByText("Filters", { selector: "h2" })).not.toBeInTheDocument());
  });

  it("deselects individual items when clicked again", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByRole("button", { name: /Select All/i }));
    expect(screen.getByRole("button", { name: /Deselect All/i })).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(screen.getByRole("button", { name: /^Select All$/i })).toBeInTheDocument();
  });

  it("shows Deselect all button when some but not all items are selected", async () => {
    const manyToDos = [
      { id: "1", title: "A", description: "desc A", completed: false },
      { id: "2", title: "B", description: "desc B", completed: false },
      { id: "3", title: "C", description: "desc C", completed: false },
    ];

    mockedService.getToDos.mockResolvedValueOnce({
      success: true,
      data: { toDos: manyToDos, total: 3, page: 1, totalPages: 1 },
    });

    render(<TodoList />);

    await screen.findByText("A");

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const deselectAllBtn = screen.getByRole("button", { name: /^Deselect all$/i });
    expect(deselectAllBtn).toBeInTheDocument();
  });

  it("deletes a single todo item", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    const editBtns = screen.getAllByText("Edit");
    fireEvent.click(editBtns[0]);

    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText(/Delete item\?/i));

    await waitFor(() => expect(toDoService.deleteToDo).toHaveBeenCalledWith("1"));
  });

  it("shows error when updateToDo fails", async () => {
    mockedService.updateToDo.mockRejectedValueOnce({ response: { data: { error: "update-failed" } } });

    render(<TodoList />);

    await screen.findByText("A");

    const editBtns = screen.getAllByText("Edit");
    fireEvent.click(editBtns[0]);

    const titleInput = screen.getByDisplayValue("A");
    fireEvent.change(titleInput, { target: { value: "Updated" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(toDoService.updateToDo).toHaveBeenCalled());
  });

  it("shows error when deleteToDo fails", async () => {
    mockedService.deleteToDo.mockRejectedValueOnce({ response: { data: { error: "delete-failed" } } });

    render(<TodoList />);

    await screen.findByText("A");

    const editBtns = screen.getAllByText("Edit");
    fireEvent.click(editBtns[0]);

    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText(/Delete item\?/i));

    await waitFor(() => expect(toDoService.deleteToDo).toHaveBeenCalled());
  });

  it("shows error when bulkUpdateToDos fails", async () => {
    mockedService.bulkUpdateToDos.mockRejectedValueOnce({ response: { data: { error: "bulk-update-failed" } } });

    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByText(/Select All/i));
    fireEvent.click(screen.getByText("Bulk Actions"));

    fireEvent.click(screen.getByText(/Mark all as Completed/i));
    fireEvent.click(screen.getByText(/Confirm$/i));

    await waitFor(() => expect(toDoService.bulkUpdateToDos).toHaveBeenCalled());
  });

  it("performs bulk delete successfully", async () => {
    render(<TodoList />);

    await screen.findByText("A");

    fireEvent.click(screen.getByText(/Select All/i));
    fireEvent.click(screen.getByText("Bulk Actions"));

    fireEvent.click(screen.getByText(/Delete items/i));
    fireEvent.click(screen.getByText(/Confirm$/i));

    await waitFor(() => expect(toDoService.bulkDeleteToDos).toHaveBeenCalledWith(["1", "2"]));
  });

  it("changes sort order when selecting A-Z", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    const sortSelect = screen.getByTestId ? screen.getByRole("combobox") : document.getElementById("sort-by");
    fireEvent.change(sortSelect!, { target: { value: "a-z" } });

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, undefined, { sortBy: "title", sortOrder: "asc" });
    });
  });

  it("changes sort order when selecting Z-A", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "z-a" } });

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, undefined, { sortBy: "title", sortOrder: "desc" });
    });
  });

  it("changes sort order when selecting created date newer to older", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "created-desc" } });

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, undefined, { sortBy: "created_date", sortOrder: "desc" });
    });
  });

  it("changes sort order when selecting updated date older to newer", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "updated-asc" } });

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, undefined, { sortBy: "updated_date", sortOrder: "asc" });
    });
  });

  it("maintains sort when applying filters", async () => {
    mockedService.getToDos
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } })
      .mockResolvedValueOnce({ success: true, data: { toDos: mockToDos, total: 2, page: 1, totalPages: 1 } });

    render(<TodoList />);

    await screen.findByText("A");

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "a-z" } });

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, undefined, { sortBy: "title", sortOrder: "asc" });
    });

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    
    await waitFor(() => expect(screen.getAllByRole("combobox").length).toBeGreaterThan(1));

    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => {
      expect(toDoService.getToDos).toHaveBeenCalledWith(1, 10, { title: "Test" }, { sortBy: "title", sortOrder: "asc" });
    });
  });
});
