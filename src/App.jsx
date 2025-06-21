import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import BossSelection from "./components/BossSelection";
import MusicDisclaimer from "./components/MusicDisclaimer";
import { Howl } from "howler";

const bosses = [
  {
    name: "sir william",
    health: 100,
    moves: ["Venerable Slash", "Hesitant Strike", "Oathbreaker's Lament"],
    difficulty: "easy",
    sprite: "william_sprite.png",
    backgroundImage: "william_background.png",
    music: "battle_theme1.mp3",
    className: "william-fight",
    meowric_health: 100
  },
  {
    name: "rhaegal",
    health: 300,
    moves: ["Crimson Feast", "Sanguine Storm", "Moonlit Blitz"],
    difficulty: "medium",
    sprite: "rhaegal_sprite.png",
    backgroundImage: "rhaegal_background.png",
    music: "battle_theme2.mp3",
    className: "rhaegal-fight",
    meowric_health: 200
  },
  {
    name: "vortal",
    health: 500,
    moves: ["Cosmic Rupture", "Oblivion's Maw", "Fateweaver's Calling", "Godspeed"],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png ",
    music: "battle_theme3.mp3",
    className: "vortal-fight",
    meowric_health: 200
  },
];

function App() {
  const [gameState, setGameState] = useState("music_disclaimer"); // title, boss, fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSong, setCurrentSong] = useState("title_theme.mp3");
 
  useEffect(() => {
    if(musicEnabled) {
      const backgroundMusic = new Howl({
        src: [`/music/${currentSong}`],
        loop: true,
        volume: 0.5
      });
      backgroundMusic.play();

      return () => {
        backgroundMusic.stop();
      }
    }
  }, [musicEnabled, currentSong])

  const startGame = () => {
    setGameState("boss");
  };

  const returnToBossSelection = () => {
    setCurrentSong("title_theme.mp3")
    setGameState("boss");
  };
  const selectBoss = (boss) => {
    const bossData = bosses.find((b) => b.name === boss);
    setCurrentSong(bossData.music)
    setSelectedBoss(bossData);
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
      {gameState === "music_disclaimer" && <MusicDisclaimer onAccept={handleMusicAccept} onDecline={handleMusicDecline}/>}
      {gameState === "title" && <TitleScreen onStart={startGame} />}
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} />}
      {gameState === "fight" && (
        <GameScreen boss={selectedBoss} onRun={returnToBossSelection} />
      )}
    </>
  );
}

export default App;
