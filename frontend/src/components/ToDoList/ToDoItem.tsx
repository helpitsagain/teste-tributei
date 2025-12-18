import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import TodoItemEdit from "./ToDoItemEdit";
import "./ToDoItem.scss";

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
    <div className={`todo-item ${isSelected ? 'todo-item--selected' : ''}`}>
      <div className="todo-item__header">
        <div className="todo-item__left">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(todo.id)}
          />
          <span>ID: {todo.id}</span>
        </div>
        <div className="todo-item__actions">
          <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
          <button onClick={handleToggleComplete}>
            Mark as {todo.completed ? "Incomplete" : "Completed"}
          </button>
        </div>
      </div>
      {isEditing ? (
        <TodoItemEdit
          todo={todo}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="todo-item__content">
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p className={`status ${todo.completed ? 'status--completed' : 'status--pending'}`}>
            Status: {todo.completed ? "Completed" : "Pending"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
