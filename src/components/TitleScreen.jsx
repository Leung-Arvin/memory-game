import React from "react";
import PixelButton from "./PixelButton";

const TitleScreen = ({ onStart }) => {
  return (
    <div className="title-screen-container">
      <h1 style={{ width: "50%", textAlign: "center" }}>The Fading Tail</h1>
      <p className="pulse-text">Meowric's Adventures</p>
    </div>
  );
};

export default TitleScreen;
