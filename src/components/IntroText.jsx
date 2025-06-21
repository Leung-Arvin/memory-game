import React, { useState, useEffect } from "react";
import "./styles/IntroText.css";

const paragraphs = [
  `SIR MEOWRIC...\nTHE GREATEST WARRIOR\nOF THE NINE-CLAWED KINGDOM...\nNOW STANDS ALONE.`,
  `THE SACRED TAIL OF TIME\nHAS BEEN STOLEN.\nTHE SOURCE OF A CAT'S\nNINE LIVES... GONE.`,
  `MONSTERS ROAM WILD.\nTHE WORLD IS SINKING INTO SHADOW.`,
  `AND MEOWRIC...\nIS DOWN TO HIS FINAL LIFE.`,
  `ONE QUEST.\nONE LAST CHANCE.\nIF HE FALLS...\nHE FALLS FOR GOOD.`,
];

export default function IntroText({ onDone }) {
  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [fade, setFade] = useState(true);

  const currentParagraph = paragraphs[paraIndex];

  useEffect(() => {
    if (!completed && charIndex < currentParagraph.length) {
      const timeout = setTimeout(() => {
        setCharIndex((i) => i + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, completed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleContinue = () => {
    if (!completed) {
      setCharIndex(currentParagraph.length);
      setCompleted(true);
    } else if (paraIndex < paragraphs.length - 1) {
      setFade(false);
      setTimeout(() => {
        setParaIndex((i) => i + 1);
        setCharIndex(0);
        setCompleted(false);
        setFade(true);
      }, 500);
    } else {
      onDone();
    }
  };

  const handleSkip = () => {
    onDone();
  };

  return (
    <div className="intro-container">
      <pre className={`typewriter-text ${fade ? "fade-in" : "fade-out"}`}>
        {currentParagraph.slice(0, charIndex)}
        {!completed && <span className="blinking-cursor">|</span>}
      </pre>
      <p className="continue-hint">Press ⏎ to continue</p>
      <button className="skip-button" onClick={handleSkip}>
        Skip
      </button>
    </div>
  );
}
