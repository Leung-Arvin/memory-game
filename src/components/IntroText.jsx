import React, { useState, useEffect } from "react";
import "./styles/IntroText.css";
import { Howl } from "howler";

const paragraphs = [
  `SIR MEOWRIC...\nTHE GREATEST WARRIOR\nOF THE NINE-CLAWED KINGDOM...\nNOW STANDS ALONE.`,
  `THE SACRED TAIL OF TIME\nHAS BEEN STOLEN.\nTHE SOURCE OF A CAT'S\nNINE LIVES... GONE.`,
  `MONSTERS ROAM WILD.\nTHE WORLD IS SINKING INTO SHADOW.`,
  `AND MEOWRIC...\nIS DOWN TO HIS FINAL LIFE.`,
  `ONE QUEST.\nONE LAST CHANCE.\nIF HE FALLS...\nHE FALLS FOR GOOD.`,
];

const typingSound = new Howl({
  src: ["/music/typing.mp3"],
  volume: 0.3,
  loop: true,
  preload: true,
  onloaderror: () => console.error("Failed to load typing sound"),
});

export default function IntroText({ onDone }) {
  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [fade, setFade] = useState(true);

  const currentParagraph = paragraphs[paraIndex];

  // Typing effect
  useEffect(() => {
    if (!completed && charIndex < currentParagraph.length) {
      const timeout = setTimeout(() => {
        setCharIndex((i) => i + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, completed, currentParagraph.length]);

  // Sound control
  useEffect(() => {
    if (!completed && charIndex < currentParagraph.length) {
      if (!typingSound.playing()) {
        typingSound.play();
      }
    } else {
      typingSound.stop();
    }
  }, [charIndex, completed]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!completed) {
          // Finish typing
          setCharIndex(currentParagraph.length);
          setCompleted(true);
        } else {
          // Move to next paragraph or finish
          handleContinue();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, paraIndex, currentParagraph]);

  const handleContinue = () => {
    if (paraIndex < paragraphs.length - 1) {
      setFade(false);
      setTimeout(() => {
        setParaIndex((i) => i + 1);
        setCharIndex(0);
        setCompleted(false);
        setFade(true);
      }, 500);
    } else {
      typingSound.stop();
      onDone();
    }
  };

  const handleSkip = () => {
    typingSound.stop();
    onDone();
  };

  return (
    <div className="intro-container">
      <pre
        className={`typewriter-text ${fade ? "fade-in" : "fade-out"}`}
        style={{ whiteSpace: "pre-wrap" }}
      >
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
