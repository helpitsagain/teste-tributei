import React, { useState } from "react";
import { ToDo } from "../../types/toDo";

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
    <div>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default TodoItemEdit;
