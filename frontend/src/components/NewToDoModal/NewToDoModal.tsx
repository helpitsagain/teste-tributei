import React from "react";
import { ToDo } from "../../types/toDo";

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
        <h2>Create new to-do</h2>
        <div>include form for new to-do</div>
        <br />
        <div>
          <button onClick={handleCreate}>Create</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewToDoModal;
