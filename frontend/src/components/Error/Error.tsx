import React from "react";
import "./Error.scss";

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="error">
      <div className="error__icon">⚠️</div>
      <p className="error__message">{message}</p>
      <button className="error__retry-button" onClick={onRetry}>Retry</button>
    </div>
  );
};

export default Error;
