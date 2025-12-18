import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import TodoItemEdit from "./ToDoItemEdit";

interface TodoItemProps {
  todo: ToDo;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (todo: ToDo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleSave = (updatedTodo: ToDo) => {
    onUpdate(updatedTodo);
    setIsEditing(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(todo.id)}
        />
        <span>ID: {todo.id}</span>
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        <button onClick={handleToggleComplete}>
          Mark as {todo.completed ? "Incomplete" : "Completed"}
        </button>
      </div>
      {isEditing ? (
        <TodoItemEdit
          todo={todo}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
