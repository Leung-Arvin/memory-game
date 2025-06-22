import React, { useState, useEffect, useMemo } from "react";
import "./styles/IntroText.css";
import { Howl } from "howler";

const paragraphs = [
  `SIR MEOWRIC...\nTHE GREATEST WARRIOR\nOF THE NINE-CLAWED KINGDOM...\nNOW STANDS ALONE.`,
  `THE SACRED TAIL OF TIME\nHAS BEEN STOLEN.\nTHE SOURCE OF A CAT'S\nNINE LIVES... GONE.`,
  `MONSTERS ROAM WILD.\nTHE WORLD IS SINKING INTO SHADOW.`,
  `AND MEOWRIC...\nIS DOWN TO HIS FINAL LIFE.`,
  `ONE QUEST.\nONE LAST CHANCE.\nIF HE FALLS...\nHE FALLS FOR GOOD.`,
];

export default function IntroText({ onDone, effectsVolume, sfxEnabled }) {
  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [fade, setFade] = useState(true);

  const currentParagraph = paragraphs[paraIndex];

  const typingSound = useMemo(() => {
    return new Howl({
      src: ["/music/typing.mp3"],
      volume: effectsVolume,
      loop: true,
      preload: true,
    });
  }, [effectsVolume]);

  useEffect(() => {
    if (!completed && charIndex < currentParagraph.length) {
      const timeout = setTimeout(() => {
        setCharIndex((i) => i + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, completed, currentParagraph.length]);

  useEffect(() => {
    if (!completed && charIndex < currentParagraph.length) {
      if (sfxEnabled && !typingSound.playing()) {
        typingSound.play();
      }
    } else {
      typingSound.stop();
    }
  }, [charIndex, completed, sfxEnabled, typingSound]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!completed) {
          setCharIndex(currentParagraph.length);
          setCompleted(true);
        } else {
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
