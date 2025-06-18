import React from "react";

const TitleScreen = ({ onStart }) => {
  return (
    <div className="title-screen-container">
      <h1 style={{ width: "50%", textAlign: "center" }}>The Fading Tail</h1>
      <p className="pulse-text">Meowric's Adventures</p>
      <h2>
        <a onClick={onStart}>Click to start</a>
      </h2>
    </div>
  );
};

export default TitleScreen;
