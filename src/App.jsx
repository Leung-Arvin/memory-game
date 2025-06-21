import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import BossSelection from "./components/BossSelection";
import MusicDisclaimer from "./components/MusicDisclaimer";
import SoundSettings from "./components/soundSettings";
import { Howl } from "howler";

const bosses = [
  {
    name: "sir william",
    health: 100,
    moves: ["slash", "stab"],
    difficulty: "easy",
    sprite: "william_sprite.png",
    backgroundImage: "william_background.png",
    music: "battle_theme1.mp3",
    className: "william-fight"
  },
  {
    name: "rhaegal",
    health: 200,
    moves: ["slash", "stab"],
    difficulty: "medium",
    sprite: "rhaegal_sprite.png",
    backgroundImage: "rhaegal_background.png",
    music: "battle_theme2.mp3",
    className: "rhaegal-fight"
  },
  {
    name: "vortal",
    health: 300,
    moves: ["slash", "s tab"],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png ",
    music: "battle_theme3.mp3",
    className: "vortal-fight"
  },
];

function App() {
  const [gameState, setGameState] = useState("music_disclaimer"); // title, boss, fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSong, setCurrentSong] = useState("title_theme.mp3");
  const [showSettings, setShowSettings] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [effectsVolume, setEffectsVolume] = useState(0.8);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSettings(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply volume changes to Howler
  useEffect(() => {
    if (window.Howler) {
      window.Howler.volume(musicVolume);
    }
  }, [musicVolume]);

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
       <SoundSettings 
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        soundEffectsEnabled={soundEffectsEnabled}
        setSoundEffectsEnabled={setSoundEffectsEnabled}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        effectsVolume={effectsVolume}
        setEffectsVolume={setEffectsVolume}
      />
    </>
  );
}

export default App;
