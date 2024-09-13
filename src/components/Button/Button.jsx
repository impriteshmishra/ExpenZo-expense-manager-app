import React from "react";
import "./buttonstyle.css";
function Button({ text, onClick, blue, disabled, img }) {
  return (
    <div className={"btn" } onClick={onClick} disabled={disabled}>
    {img}  {text}
    </div>
  );
}

export default Button;
