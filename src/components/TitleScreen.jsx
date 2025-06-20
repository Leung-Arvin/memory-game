import React from "react";
import PixelButton from "./PixelButton";
import "./styles/TitleScreen.css"; 

const TitleScreen = ({ onStart }) => {
  return (
    <div className="title-screen-container">
      <h1 style={{ width: "50%", textAlign: "center" }} className="title">The Fading Tail</h1>
      <p className="subtitle">Meowric's Adventures</p>
      <h2>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onStart();
          }}
          style={{
            cursor: "pointer",
            color: "#f9c62c",
            textDecoration: "none",
          }}
          className="blinking-text"
        >
          Click to start
        </a>
      </h2>
    </div>
  );
};

export default TitleScreen;
