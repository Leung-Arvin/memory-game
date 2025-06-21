import React, { useState } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import BossSelection from "./components/BossSelection";
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
  },
  {
    name: "rhaegal",
    health: 200,
    moves: ["slash", "stab"],
    difficulty: "medium",
    sprite: "rhaegal_sprite.png",
    backgroundImage: "rhaegal_background.png",
  },
  {
    name: "vortal",
    health: 300,
    moves: ["slash", "stab"],
    difficulty: "hard",
    sprite: "vortal_sprite.png",
    backgroundImage: "vortal_background.png",
  },
];

function App() {
  const [gameState, setGameState] = useState("title"); // title → intro → boss → fight
  const [selectedBoss, setSelectedBoss] = useState(null);

  // When "Start" is clicked on TitleScreen
  const startGame = () => {
    setGameState("intro");
  };

  const handleIntroDone = () => {
    setGameState("cutscene");
  };

  const returnToBossSelection = () => {
    setGameState("boss");
  };

  const selectBoss = (bossName) => {
    const bossData = bosses.find((b) => b.name === bossName);
    setSelectedBoss(bossData);
    setGameState("fight");
  };

  return (
    <>
      {gameState === "title" && <TitleScreen onStart={startGame} />}
      {gameState === "intro" && <IntroText onDone={handleIntroDone} />}
      {gameState === "cutscene" && (
        <IntroCutScene onFinish={() => setGameState("boss")} />
      )}
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} />}
      {gameState === "fight" && (
        <GameScreen boss={selectedBoss} onRun={returnToBossSelection} />
      )}
    </>
  );
}

export default App;
