import React, { useState, useEffect } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import BossSelection from "./components/BossSelection";
import MusicDisclaimer from "./components/MusicDisclaimer";
import SoundSettings from "./components/soundSettings";
import { Howl } from "howler";
import IntroText from "./components/IntroText";
import IntroCutScene from "./components/IntroCutScene";

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
    meowric_health: 100,
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
    meowric_health: 200,
  },
  {
    name: "vortal",
    health: 500,
    moves: [
      "Cosmic Rupture",
      "Oblivion's Maw",
      "Fateweaver's Calling",
      "Godspeed",
    ],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png ",
    music: "battle_theme3.mp3",
    className: "vortal-fight",
    meowric_health: 200,
  },
];

const getSoundEffects = (volume) => ({
  click: new Howl({
    src: ["/music/click.wav"],
    volume: volume,
  }),
});

function App() {
  const [gameState, setGameState] = useState("music_disclaimer");
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSong, setCurrentSong] = useState("title_theme.mp3");
  const [showSettings, setShowSettings] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [effectsVolume, setEffectsVolume] = useState(0.5);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowSettings((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply volume changes to Howler music globally
  useEffect(() => {
    if (window.Howler) {
      window.Howler.volume(musicVolume);
    }
  }, [musicVolume]);

  const playSound = (soundName) => {
    if (soundEffectsEnabled) {
      const sfx = getSoundEffects(effectsVolume);
      if (sfx[soundName]) {
        sfx[soundName].play();
      }
    }
  };

  // Music playback on state change
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
      {gameState === "intro" && (
        <IntroText
          onDone={handleIntroDone}
          effectsVolume={effectsVolume}
          sfxEnabled={soundEffectsEnabled}
        />
      )}
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
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} setGameState={setGameState} />}
      {gameState === "fight" && (
        <GameScreen
          boss={selectedBoss}
          onRun={returnToBossSelection}
          effectsVolume={effectsVolume}
          sfxEnabled={soundEffectsEnabled}
        />
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
