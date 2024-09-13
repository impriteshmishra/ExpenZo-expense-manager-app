import React from "react";
import "./inputCompStyle.css";
function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="custom-input"
        type={type}
      />
    </div>
  );
}

export default Input;
