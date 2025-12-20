import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import "./BulkActionModal.scss";

interface BulkActionModalProps {
  selectedIds: string[];
  toDos: ToDo[];
  onConfirm: (updates: Partial<ToDo>) => void;
  onDelete: (ids: string[]) => void;
  onCancel: () => void;
}

type PendingAction = "complete" | "pending" | "delete" | null;

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  selectedIds,
  toDos,
  onConfirm,
  onDelete,
  onCancel,
}) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const selectedToDos = toDos.filter((todo) => selectedIds.includes(todo.id));

  const startConfirm = (action: PendingAction) => {
    setPendingAction(action);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction === "complete") {
      onConfirm({ completed: true });
    } else if (pendingAction === "pending") {
      onConfirm({ completed: false });
    } else if (pendingAction === "delete") {
      onDelete(selectedIds);
    }

    setPendingAction(null);
    onCancel();
  };

  const handleCancelConfirm = () => {
    setPendingAction(null);
  };

  const actionTitle = (action: PendingAction) => {
    switch (action) {
      case "complete":
        return "Mark all as Completed";
      case "pending":
        return "Mark all as Pending";
      case "delete":
        return "Delete items";
      default:
        return "";
    }
  };

  const handleCompleted = () => {
    onConfirm({ completed: true });
  };

  const handlePending = () => {
    onConfirm({ completed: false });
  };

  const handleDelete = () => {
    onDelete(selectedIds);
  };

  return (
    <div className="modal-overlay">
      <div className="bulk-action-modal">
        {!pendingAction ? (
          <>
            <h2 id="bulk-action-title" className="bulk-action-modal__title">
              Bulk Action
            </h2>
            <p className="bulk-action-modal__description">
              You are about to update {selectedIds.length} items.
            </p>

            <div className="bulk-action-modal__preview">
              <h3>Preview:</h3>
              <ul>
                {selectedToDos.slice(0, 5).map((todo) => (
                  <li key={todo.id}>{todo.title}</li>
                ))}
                {selectedToDos.length > 5 && (
                  <li>...and {selectedToDos.length - 5} more</li>
                )}
              </ul>
            </div>

            <div className="bulk-action-modal__actions">
              <button onClick={() => startConfirm("complete")}>
                Mark all as Completed
              </button>
              <button onClick={() => startConfirm("pending")}>
                Mark all as Pending
              </button>
              <button onClick={() => startConfirm("delete")}>
                Delete items
              </button>
              <button onClick={onCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <div className="bulk-action-modal__confirm">
            <h2 className="bulk-action-modal__title">Confirm action</h2>
            <p className="bulk-action-modal__description">
              Are you sure you want to{" "}
              <strong>{actionTitle(pendingAction).toLowerCase()}</strong> for{" "}
              <strong>
                {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}
              </strong>
              ?
            </p>
            {pendingAction === "delete" && (
              <p>
                This action <strong>cannot be undone.</strong>
              </p>
            )}
            <div className="bulk-action-modal__preview">
              <h3>Preview:</h3>
              <ul>
                {selectedToDos.slice(0, 5).map((todo) => (
                  <li key={todo.id}>{todo.title}</li>
                ))}
                {selectedToDos.length > 5 && (
                  <li>...and {selectedToDos.length - 5} more</li>
                )}
              </ul>
            </div>

            <div className="bulk-action-modal__actions">
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleCancelConfirm}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionModal;
