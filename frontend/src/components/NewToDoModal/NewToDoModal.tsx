import React from "react";
import { ToDo } from "../../types/toDo";
import "./NewToDoModal.scss";

interface NewToDoModalProps {
  newToDo: Partial<ToDo>;
  onConfirm: (newToDo: Partial<ToDo>) => void;
  onCancel: () => void;
}

const NewToDoModal: React.FC<NewToDoModalProps> = ({
  newToDo,
  onConfirm,
  onCancel,
}) => {
  const handleCreate = () => {
    onConfirm(newToDo);
  };

  return (
    <div className="modal-overlay">
      <div className="new-todo-modal">
        <h2 className="new-todo-modal__title">Create new to-do</h2>
        <div className="new-todo-modal__content">include form for new to-do</div>
        <div className="new-todo-modal__actions">
          <button onClick={handleCreate}>Create</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewToDoModal;
