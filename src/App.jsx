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
    moves: ["slash", "stab"],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png ",
    music: "battle_theme3.mp3",
    className: "vortal-fight",
  },
];

const soundEffects = {
  click: new Howl({
    src: ["/music/click.wav"],
    volume: 0.3,
  }),
};

function App() {
  const [gameState, setGameState] = useState("music_disclaimer"); // title → intro → boss → fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSong, setCurrentSong] = useState("title_theme.mp3");
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const playSound = (soundName) => {
    if (sfxEnabled && soundEffects[soundName]) {
      soundEffects[soundName].play();
    }
  };

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
    playSound("click");
    setGameState("intro");
  };
  const handleIntroDone = () => {
    playSound("click");
    setGameState("cutscene");
  };

  const returnToBossSelection = () => {
    playSound("click");
    setCurrentSong("title_theme.mp3");
    setGameState("boss");
  };
  const selectBoss = (boss) => {
    const bossData = bosses.find((b) => b.name === boss);
    setCurrentSong(bossData.music);
    setSelectedBoss(bossData);
    playSound("click");
    setGameState("fight");
  };
  const handleMusicAccept = () => {
    setMusicEnabled(true);
    setGameState("title");
  };

  const handleMusicDecline = () => {
    setMusicEnabled(false);
    setGameState("title");
  };
  return (
    <>
      {gameState === "music_disclaimer" && (
        <MusicDisclaimer
          onAccept={() => {
            playSound("click");
            handleMusicAccept();
          }}
          onDecline={() => {
            playSound("click");
            handleMusicDecline();
          }}
        />
      )}
      {gameState === "intro" && <IntroText onDone={handleIntroDone} />}
      {gameState === "cutscene" && (
        <IntroCutScene
          onFinish={() => {
            playSound("click");
            setGameState("boss");
          }}
        />
      )}
      {gameState === "title" && (
        <TitleScreen
          onStart={() => {
            playSound("click");
            startGame();
          }}
        />
      )}
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} />}
      {gameState === "fight" && (
        <GameScreen boss={selectedBoss} onRun={returnToBossSelection} />
      )}
    </>
  );
}

export default App;
