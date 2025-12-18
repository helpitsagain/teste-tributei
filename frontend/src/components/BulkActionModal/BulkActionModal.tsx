import React from "react";
import { ToDo } from "../../types/toDo";
import "./BulkActionModal.scss";

interface BulkActionModalProps {
  selectedIds: string[];
  todos: ToDo[];
  onConfirm: (updates: Partial<ToDo>) => void;
  onDelete: (ids: string[]) => void;
  onCancel: () => void;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  selectedIds,
  todos,
  onConfirm,
  onDelete,
  onCancel,
}) => {
  const selectedToDos = todos.filter((todo) => selectedIds.includes(todo.id));

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
        <h2 className="bulk-action-modal__title">Bulk Action</h2>
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
          <button onClick={handleCompleted}>Mark all as Completed</button>
          <button onClick={handlePending}>Mark all as Pending</button>
          <button onClick={handleDelete}>Delete items</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
