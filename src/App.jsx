import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import BossSelection from "./components/BossSelection";
import MusicDisclaimer from "./components/MusicDisclaimer";
import { Howl } from "howler";
import IntroText from "./components/IntroText";
import IntroCutScene from "./components/IntroCutScene";

const bosses = [
  {
    name: "sir william",
    health: 100,
    moves: ["slash", "stab"],
    difficulty: "easy",
    sprite: "william_sprite.png",
    backgroundImage: "william_background.png",
    music: "battle_theme1.mp3",
    className: "william-fight",
  },
  {
    name: "rhaegal",
    health: 200,
    moves: ["slash", "stab"],
    difficulty: "medium",
    sprite: "rhaegal_sprite.png",
    backgroundImage: "rhaegal_background.png",
    music: "battle_theme2.mp3",
    className: "rhaegal-fight",
  },
  {
    name: "vortal",
    health: 300,
    moves: ["slash", "s tab"],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png ",
    music: "battle_theme3.mp3",
    className: "vortal-fight",
  },
];

function App() {
  const [gameState, setGameState] = useState("music_disclaimer"); // title → intro → boss → fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSong, setCurrentSong] = useState("title_theme.mp3");

  useEffect(() => {
    if (musicEnabled) {
      const backgroundMusic = new Howl({
        src: [`/music/${currentSong}`],
        loop: true,
        volume: 0.5,
      });
      backgroundMusic.play();

      return () => {
        backgroundMusic.stop();
      };
    }
  }, [musicEnabled, currentSong]);
  const startGame = () => {
    setGameState("intro");
  };
  const handleIntroDone = () => {
    setGameState("cutscene");
  };

  const returnToBossSelection = () => {
    setCurrentSong("title_theme.mp3");
    setGameState("boss");
  };
  const selectBoss = (boss) => {
    const bossData = bosses.find((b) => b.name === boss);
    setSelectedBoss(bossData);
    setGameState("fight");
  };
  return (
    <>
      {gameState === "music_disclaimer" && (
        <MusicDisclaimer
          onAccept={handleMusicAccept}
          onDecline={handleMusicDecline}
        />
      )}
      {gameState === "intro" && <IntroText onDone={handleIntroDone} />}
      {gameState === "cutscene" && (
        <IntroCutScene onFinish={() => setGameState("boss")} />
      )}
      {gameState === "title" && <TitleScreen onStart={startGame} />}
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} />}
      {gameState === "fight" && (
        <GameScreen boss={selectedBoss} onRun={returnToBossSelection} />
      )}
    </>
  );
}

export default App;
