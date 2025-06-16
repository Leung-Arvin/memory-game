import React, { useState, useEffect } from 'react';
import './App.css';
import GameScreen from './components/GameScreen';

function App() {
  const [gameState, setGameState] = useState("title"); // title, boss, fight
  const [selectedBoss, setSelectedBoss] = useState(null);
  const startGame = () => { setGameState("boss");}
  const selectBoss = () => { 
    setSelectedBoss(); // insert boss data here
    setGameState("fight");
  }
  return(
    <>
    { gameState === "title" && <TitleScreen/> }
    { gameState === "boss" && <BossSelection/> }
    { gameState === "fight" && <GameScreen/> }
    </>
  );
}

export default App;