import React from "react";
import "./Loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader__spinner"></div>
      <span className="loader__text">Loading...</span>
    </div>
  );
};

export default Loader;
