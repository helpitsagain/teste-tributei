import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import TodoItemEdit from "./ToDoItemEdit";
import "./ToDoItem.scss";

interface TodoItemProps {
  todo: ToDo;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (todo: ToDo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleStatus = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleSave = (updatedTodo: ToDo) => {
    onUpdate(updatedTodo);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${isSelected ? "todo-item--selected" : ""}`}>
      <div className="todo-item__header">
        <div className="todo-item__left">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(todo.id)}
          />
          <button
            className={`toggle-status ${!!todo.completed && "pending"}`}
            onClick={handleToggleStatus}
          >
            Mark as {todo.completed ? "Pending" : "Completed"}
          </button>
        </div>
        <div className="todo-item__left__actions">
          <button className="edit" onClick={() => setIsEditing(!isEditing)}>
            Edit
          </button>
        </div>
      </div>
      {isEditing ? (
        <TodoItemEdit
          todo={todo}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          onDelete={handleDelete}
        />
      ) : (
        <div
          className="todo-item__content"
          onClick={() => {
            onSelect(todo.id);
          }}
        >
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p
            className={`status ${todo.completed ? "status--completed" : "status--pending"}`}
          >
            Status: {todo.completed ? "Completed" : "Pending"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
