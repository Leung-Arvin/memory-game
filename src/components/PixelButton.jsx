import React from "react";

const PixelButton = ({ label, onClick, color = "#6abc3a" }) => {
  const style = {
    backgroundColor: color,
  };

  return (
    <button className="pixel-button" onClick={onClick} style={style}>
      {label}
    </button>
  );
};
// <PixelButton label="Click to start" onClick={onStart} color="#e86c6c" />
//implementing button ^
export default PixelButton;
