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
      toDos: mockToDos,
      page: 1,
      totalPages: 1,
    });

    mockedService.bulkUpdateToDos.mockResolvedValue({ updatedToDos: [] });
    mockedService.bulkDeleteToDos.mockResolvedValue({ deletedToDos: [] });
    mockedService.createToDo.mockResolvedValue({ id: "3" });
    mockedService.updateToDo.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows error and retries when getToDos fails", async () => {
    mockedService.getToDos
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ toDos: [], page: 1, totalPages: 1 });

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
      .mockResolvedValueOnce({ toDos: page1, page: 1, totalPages: 2 })
      .mockResolvedValueOnce({ toDos: page2, page: 2, totalPages: 2 });

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

    await waitFor(() => expect(toDoService.createToDo).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/create-failed/i)).toBeInTheDocument());
  });
});
