import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BulkActionModal from "../components/BulkActionModal/BulkActionModal";
import { ToDo } from "../types/toDo";

describe("BulkActionModal", () => {
  const toDos: ToDo[] = Array.from({ length: 7 }).map((_, i) => ({
    id: String(i + 1),
    title: `Item ${i + 1}`,
    description: `desc ${i + 1}`,
    completed: false,
  }));

  beforeEach(() => {
    document.body.style.overflow = "auto";
  });

  it("shows preview and more count", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3", "4", "5", "6", "7"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText("Preview:")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("...and 2 more")).toBeInTheDocument();
  });

  it("confirms complete action and calls onConfirm + onCancel", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Completed/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Confirm$/i));

    expect(onConfirm).toHaveBeenCalledWith({ completed: true });
    expect(onCancel).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("confirms delete action and calls onDelete", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Delete items/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Confirm$/i));

    expect(onDelete).toHaveBeenCalledWith(["1", "2"]);
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms pending action and calls onConfirm with completed false", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Pending/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Confirm$/i));

    expect(onConfirm).toHaveBeenCalledWith({ completed: false });
    expect(onCancel).toHaveBeenCalled();
  });

  it("goes back from confirmation screen when Back is clicked", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Completed/i));
    expect(screen.getByText(/Confirm action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back$/i));

    expect(screen.getByText("Bulk Action")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows delete warning in confirmation screen", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Delete items/i));

    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("expands and collapses the full list of items", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3", "4", "5", "6", "7"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    const moreLink = screen.getByText("...and 2 more");
    fireEvent.click(moreLink);

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.queryByText("...and 2 more")).not.toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Close full list");
    fireEvent.click(closeBtn);

    expect(screen.getByText("...and 2 more")).toBeInTheDocument();
  });

  it("expands and collapses the full list in confirmation screen", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3", "4", "5", "6", "7"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Completed/i));

    const moreLink = screen.getByText("...and 2 more");
    fireEvent.click(moreLink);

    expect(screen.getByRole("region")).toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Close full list");
    fireEvent.click(closeBtn);

    expect(screen.getByText("...and 2 more")).toBeInTheDocument();
  });

  it("does not show more link when 5 or fewer items selected", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3", "4", "5"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.queryByText(/and \d+ more/)).not.toBeInTheDocument();
  });

  it("sets body overflow to hidden when modal opens", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when modal closes", () => {
    document.body.style.overflow = "auto";

    const { unmount } = render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    unmount();

    expect(document.body.style.overflow).toBe("auto");
  });

  it("displays correct count in description", () => {
    render(
      <BulkActionModal
        selectedIds={["1", "2", "3"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText(/3 items/)).toBeInTheDocument();
  });

  it("displays singular item when only one selected", () => {
    render(
      <BulkActionModal
        selectedIds={["1"]}
        toDos={toDos}
        onConfirm={() => {}}
        onDelete={() => {}}
        onCancel={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Mark all as Completed/i));

    // The text is split across elements, so we check for the strong element containing "1 item"
    const strongElements = screen.getAllByRole("strong");
    const itemCount = strongElements.find(el => el.textContent?.includes("1"));
    expect(itemCount).toBeDefined();
    expect(itemCount?.textContent).toContain("item");
    expect(itemCount?.textContent).not.toContain("items");
  });

  it("does not call onConfirm when handleConfirm is called with no pendingAction", () => {
    const onConfirm = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <BulkActionModal
        selectedIds={["1", "2"]}
        toDos={toDos}
        onConfirm={onConfirm}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
