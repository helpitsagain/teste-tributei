import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import "./ToDoItemEdit.scss";

interface TodoItemEditProps {
  todo: ToDo;
  onSave: (todo: ToDo) => void;
  onCancel: () => void;
}

const TodoItemEdit: React.FC<TodoItemEditProps> = ({
  todo,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  const handleSave = () => {
    onSave({ ...todo, title, description });
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
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default TodoItemEdit;
