import React, { useState, useEffect } from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import TitleScreen from './components/TitleScreen';
import BossSelection from './components/BossSelection';

const bosses = [
  { name: 'sir william', health: 100, moves: ['slash', 'stab'], difficulty: 'easy', sprite: 'william_sprite.png', backgroundImage: 'william_background.png' },
  { name: 'rhaegal', health: 200, moves: ['slash', 'stab'], difficulty: 'medium', sprite: 'rhaegal_sprite.png', backgroundImage: 'rhaegal_background.png' },
  { name: 'vortal', health: 300, moves: ['slash', 's tab'], difficulty: 'hard', sprite: 'vortal_sprite.png', backgroundImage: 'vortal_background.png ' }
]

function App() {
  const [gameState, setGameState] = useState("title"); // title, boss, fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const startGame = () => { setGameState("boss");}
  const returnToBossSelection = () => {
    setGameState("boss");
  }
  const selectBoss = (boss) => { 
    const bossData = bosses.find(b => b.name === boss);
    setSelectedBoss(bossData);
    setGameState("fight");
  }
  return (
    <>
      {gameState === "title" && <TitleScreen  onStart={startGame} />}
      {gameState === "boss" && <BossSelection onBossSelect={selectBoss} />}
      {gameState === "fight" && <GameScreen boss={selectedBoss} onRun={returnToBossSelection}  />}
    </>
  );
}

export default App;
