import React from "react";
import { ToDo } from "../../types/toDo";

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
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h2>Bulk Action</h2>
        <p>You are about to update {selectedIds.length} items.</p>
        <div>
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
        <div>
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
