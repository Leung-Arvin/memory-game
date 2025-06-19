import React, { useState, useEffect } from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import TitleScreen from './components/TitleScreen';
import BossSelection from './components/BossSelection';

const bosses = [
  { name: 'sir william', health: 100, moves: ['slash', 'stab'], difficulty: 'easy', sprite: 'william_sprite.png', backgroundImage: 'william_bg.png' },
  { name: 'rhaegal', health: 200, moves: ['slash', 'stab'], difficulty: 'medium', sprite: 'rhaegal_sprite.png', backgroundImage: 'william_bg.png' },
  { name: 'vortal', health: 300, moves: ['slash', 's tab'], difficulty: 'hard', sprite: 'vortal_sprite.png', backgroundImage: 'william_bg.png ' }
]

function App() {
  const [gameState, setGameState] = useState("boss"); // title, boss, fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const startGame = () => { setGameState("boss");}
  const selectBoss = (boss) => { 
    setSelectedBoss(boss);
    setGameState("fight");
  }
  return(
    <>
    { gameState === "title" && <TitleScreen /> }
    { gameState === "boss" && <BossSelection onBossSelect={selectBoss}/> }
    { gameState === "fight" && <GameScreen/> }
    </>
  );
}

export default App;