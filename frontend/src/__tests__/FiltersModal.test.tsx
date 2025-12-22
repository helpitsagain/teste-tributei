import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import FiltersModal from "../components/FiltersModal/FiltersModal";

describe("FiltersModal", () => {
  const defaultProps = {
    onConfirm: vi.fn(),
    onClearFilters: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with title and form fields", () => {
    render(<FiltersModal {...defaultProps} />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Title:")).toBeInTheDocument();
    expect(screen.getByText("Description:")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
  });

  it("renders with initial filter values", () => {
    const initialFilters = {
      title: "Test Title",
      description: "Test Description",
      completed: true,
    };

    render(<FiltersModal {...defaultProps} initialFilters={initialFilters} />);

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const statusSelect = screen.getByRole("combobox") as HTMLSelectElement;

    expect(inputs[0].value).toBe("Test Title");
    expect(inputs[1].value).toBe("Test Description");
    expect(statusSelect.value).toBe("completed");
  });

  it("renders with pending status from initial filters", () => {
    const initialFilters = {
      completed: false,
    };

    render(<FiltersModal {...defaultProps} initialFilters={initialFilters} />);

    const statusSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(statusSelect.value).toBe("pending");
  });

  it("renders with empty status when completed is null", () => {
    const initialFilters = {
      completed: null,
    };

    render(<FiltersModal {...defaultProps} initialFilters={initialFilters} />);

    const statusSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(statusSelect.value).toBe("");
  });

  it("calls onConfirm with filters when Apply is clicked", () => {
    const onConfirm = vi.fn();

    render(<FiltersModal {...defaultProps} onConfirm={onConfirm} />);

    const inputs = screen.getAllByRole("textbox");
    const statusSelect = screen.getByRole("combobox");

    fireEvent.change(inputs[0], { target: { value: "My Title" } });
    fireEvent.change(inputs[1], { target: { value: "My Description" } });
    fireEvent.change(statusSelect, { target: { value: "completed" } });

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith({
      title: "My Title",
      description: "My Description",
      completed: true,
    });
  });

  it("calls onConfirm with undefined when no filters are applied", () => {
    const onConfirm = vi.fn();

    render(<FiltersModal {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("calls onConfirm with pending status", () => {
    const onConfirm = vi.fn();

    render(<FiltersModal {...defaultProps} onConfirm={onConfirm} />);

    const statusSelect = screen.getByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "pending" } });

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith({
      completed: false,
    });
  });

  it("trims whitespace from title and description filters", () => {
    const onConfirm = vi.fn();

    render(<FiltersModal {...defaultProps} onConfirm={onConfirm} />);

    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "  Trimmed Title  " } });
    fireEvent.change(inputs[1], { target: { value: "  Trimmed Desc  " } });

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith({
      title: "Trimmed Title",
      description: "Trimmed Desc",
    });
  });

  it("does not include title or description if they are only whitespace", () => {
    const onConfirm = vi.fn();

    render(<FiltersModal {...defaultProps} onConfirm={onConfirm} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "   " } });

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const onCancel = vi.fn();

    render(<FiltersModal {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows Clear filters button when initialFilters are provided", () => {
    const onClearFilters = vi.fn();
    const initialFilters = { title: "Test" };

    render(
      <FiltersModal
        {...defaultProps}
        onClearFilters={onClearFilters}
        initialFilters={initialFilters}
      />
    );

    const clearBtn = screen.getByText("Clear filters");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);

    expect(onClearFilters).toHaveBeenCalled();
  });

  it("does not show Clear filters button when no initialFilters", () => {
    render(<FiltersModal {...defaultProps} />);

    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(<FiltersModal {...defaultProps} error="Something went wrong" />);

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it("sets body overflow to hidden when modal opens and restores on close", () => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "auto";

    const { unmount } = render(<FiltersModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = originalOverflow;
  });

  it("updates form values when user types", () => {
    render(<FiltersModal {...defaultProps} />);

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const statusSelect = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(inputs[0], { target: { value: "New Title" } });
    fireEvent.change(inputs[1], { target: { value: "New Description" } });
    fireEvent.change(statusSelect, { target: { value: "completed" } });

    expect(inputs[0].value).toBe("New Title");
    expect(inputs[1].value).toBe("New Description");
    expect(statusSelect.value).toBe("completed");
  });

  it("allows selecting Any status option", () => {
    const onConfirm = vi.fn();
    const initialFilters = { completed: true };

    render(
      <FiltersModal
        {...defaultProps}
        onConfirm={onConfirm}
        initialFilters={initialFilters}
      />
    );

    const statusSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(statusSelect.value).toBe("completed");

    fireEvent.change(statusSelect, { target: { value: "" } });

    expect(statusSelect.value).toBe("");

    fireEvent.click(screen.getByText("Apply"));

    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });
});
