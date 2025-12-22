import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import "./ToDoItemEdit.scss";

interface TodoItemEditProps {
  todo: ToDo;
  onSave: (todo: ToDo) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const TodoItemEdit: React.FC<TodoItemEditProps> = ({
  todo,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onSave({ ...todo, title, description });
  };

  const handleDelete = () => {
    setConfirmDelete((prev) => !prev);
  };

  const handleConfirmDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div className="todo-item-edit">
      <div className="todo-item-edit__form">
        <div className="todo-item-edit__field">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="todo-item-edit__field">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="todo-item-edit__actions">
        <button id="save" onClick={handleSave}>
          Save
        </button>
        <button id="cancel" onClick={onCancel}>
          Cancel
        </button>
        {confirmDelete ? (
          <button id="delete" onClick={handleConfirmDelete}>
            Delete item? <br /> This cannot be undone.
          </button>
        ) : (
          <button id="delete" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoItemEdit;
