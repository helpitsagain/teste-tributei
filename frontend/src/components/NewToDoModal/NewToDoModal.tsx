import React, { useState } from "react";
import { ToDo } from "../../types/toDo";
import Error from "../Error/Error";
import "./NewToDoModal.scss";

interface NewToDoModalProps {
  onConfirm: (newToDo: Partial<ToDo>) => void;
  onCancel: () => void;
  error?: any;
}

const NewToDoModal: React.FC<NewToDoModalProps> = ({
  onConfirm,
  onCancel,
  error,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    onConfirm({ title, description });
  };

  return (
    <div className="modal-overlay">
      <div className="new-todo-modal">
        <h2 className="new-todo-modal__title">Create new to-do</h2>
        <div className="new-todo-modal__content">
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
          </div>
        </div>
        <div className="new-todo-modal__actions">
          <button onClick={handleCreate}>Create</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
        {!!error && <Error message={error} />}
      </div>
    </div>
  );
};

export default NewToDoModal;
