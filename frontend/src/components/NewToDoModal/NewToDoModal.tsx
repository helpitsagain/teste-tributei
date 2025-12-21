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
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');

  const handleCreate = () => {
    setStep('confirm');
  };

  const handleConfirm = () => {
    onConfirm({ title, description });
    setStep('success');
  };

  const handleAddAnother = () => {
    setTitle("");
    setDescription("");
    setStep('form');
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStep('form');
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="new-todo-modal">
        {step === 'form' && (
          <>
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
              <button onClick={handleCreate} disabled={!title.trim()}>
                Create
              </button>
              <button onClick={onCancel}>Cancel</button>
            </div>
            {!!error && <Error message={error} />}
          </>
        )}

        {step === 'confirm' && (
          <>
            <h2 className="new-todo-modal__title">Confirm creation</h2>
            <div className="new-todo-modal__content">
              <p>
                <strong>Title:</strong> {title}
              </p>
              <p>
                <strong>Description:</strong> {description || '(none)'}
              </p>
            </div>
            <div className="new-todo-modal__actions">
              <button onClick={handleConfirm} disabled={!title.trim()}>
                Confirm
              </button>
              <button onClick={() => setStep('form')}>Back</button>
            </div>
            {!!error && <Error message={error} />}
          </>
        )}

        {step === 'success' && (
          <>
            <div className="new-todo-modal__success">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="12" cy="12" r="11" stroke="#28a745" strokeWidth="2" />
                <path d="M7 12.5l2.5 2.5L17 8" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>To-do created</h3>
              <p>Your to-do "{title}" was created successfully.</p>
            </div>
            <div className="new-todo-modal__actions">
              <button onClick={handleAddAnother}>Add another</button>
              <button onClick={handleClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewToDoModal;
