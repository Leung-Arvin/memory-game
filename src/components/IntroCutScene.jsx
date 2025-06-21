import React, { useState, useEffect, useRef } from "react";
import "./styles/IntroCutScene.css";
import background from "/cutsceneBackground.png";
import idleSprite from "/Meow-Knight_Idle.png";
import runSprite from "/Meow-Knight_Run.png";

const paragraphs = [
  `MEOWRIC WALKS FORWARD.\nTHE FATE OF THE KINGDOM\nRESTS WITH YOU.`,
  `ARE YOU READY TO FIGHT?`,
  `MEOWRIC,\nSET FORTH YOUR ADVENTURE.`,
];

export default function IntroCutScene({ onFinish }) {
  const [position, setPosition] = useState(70);
  const [direction, setDirection] = useState("right");
  const [isMoving, setIsMoving] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [idleFrame, setIdleFrame] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const runFrameCount = 10;
  const idleFrameCount = 6;
  const runFrameHeight = 150;
  const idleFrameHeight = 150;
  const moveSpeed = 0.5;
  const runAnimationSpeed = 120;
  const idleAnimationSpeed = 170;
  const textDisplayTime = 3500;
  useEffect(() => {
    let animationInterval;

    if (isMoving) {
      animationInterval = setInterval(() => {
        setRunFrame((prev) => (prev + 1) % runFrameCount);
      }, runAnimationSpeed);
    } else {
      animationInterval = setInterval(() => {
        setIdleFrame((prev) => (prev + 1) % idleFrameCount);
      }, idleAnimationSpeed);
    }

    return () => clearInterval(animationInterval);
  }, [isMoving]);

  useEffect(() => {
    if (textIndex < paragraphs.length - 1) {
      const timer = setTimeout(() => {
        setTextIndex((i) => i + 1);
      }, textDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setDirection("right");
        setIsMoving(true);
      } else if (e.key === "ArrowLeft") {
        setDirection("left");
        setIsMoving(true);
      } else if (e.key === "Enter") {
        onFinish();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setIsMoving(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onFinish]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (isMoving) {
        setPosition((prev) => {
          const newPos =
            direction === "right"
              ? Math.min(prev + moveSpeed, 100)
              : Math.max(prev - moveSpeed, 0);

          if (newPos >= 98) {
            setTimeout(onFinish, 800);
          }
          return newPos;
        });
      }
    }, 16);

    return () => clearInterval(moveInterval);
  }, [isMoving, direction, onFinish]);

  return (
    <div
      className="cutscene-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className={`character ${direction} ${isMoving ? "running" : "idle"}`}
        style={{
          left: `${position}%`,
          backgroundImage: `url(${isMoving ? runSprite : idleSprite})`,
          backgroundPosition: `0px -${
            isMoving ? runFrame * runFrameHeight : idleFrame * idleFrameHeight
          }px`,
        }}
      />
      <div className="cutscene-text">
        {paragraphs[textIndex].split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <p className="hint-text">Use ← → arrows to move, Enter to skip</p>
    </div>
  );
}
