import HealthBar from './common/HealthBar';
import PixelButton from './common/PixelButton';
import './styles/fight.css';
import React, { useState, useEffect } from 'react';

function GameScreen({boss}) {
  const [gameState, setGameState] = useState('start'); // 'start', 'abilities', 'blank'
  const [ability, setAbility] = useState(null);
  const [playerhealth, setPlayerHealth] = useState(100);
  const [bosshealth, setBossHealth] = useState(100);
  const [sequence, setSequence] = useState([]);
  const [sequenceState, setSequenceState] = useState(''); // 'sequence', 'player_input'
  const [playerInput, setPlayerInput] = useState([]);
  const [dots, setDots] = useState([]);
  const [activeDot, setActiveDot] = useState(null);

  const generateDots = () => {
    const newDots = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      active: false
    }));
    setDots(newDots);
    return newDots;
  }

  const startSequence = (ability) => {
    const newDots = generateDots();
    const newSequence = newDots.sort(() => 0.5 - Math.random()).slice(0, 5);

    setSequence(newSequence);
    setSequenceState('sequence');
    setPlayerInput([]);
    setGameState('sequence');
    playSequence(newSequence);
  }

  const playSequence = (seq) => {
    seq.forEach((dot, i) => {
      setTimeout(() => {
        setActiveDot(dot.id);
        setTimeout(() => setActiveDot(null), 500); // Each dot blinks for 500ms
      }, i * 800); // 800ms between dots
    });
    const totalSequenceTime = seq.length * 800 + 500; // (800ms per dot + last dot's 500ms blink)
    setTimeout(() => {
      setSequenceState('player_input'); // Now the player can input
    }, totalSequenceTime);
  };

  const handleDotClick = (dotId) => {
    if (sequenceState !== "player_input") return;
    
    const newInput = [...playerInput, dotId];
    setPlayerInput(newInput);
    
     // Check if the current input matches the sequence up to this point
  const isCorrectSoFar = newInput.every((inputDot, i) => inputDot === sequence[i].id);

  if (isCorrectSoFar) {
    const baseDamage = 10; 
    const damage = baseDamage * newInput.length; 

    if (newInput.length === sequence.length) {

      setTimeout(() => {
        setSequenceState('success');
      }, 3000);
      
      setBossHealth(prev => Math.max(0, prev - damage));
      setAbility(null);
      setGameState('start');
    }
  } else {

    setTimeout(() => {
      setSequenceState('failed');
    }, 3000);

    const penaltyDamage = 5; 
    setBossHealth(prev => Math.max(0, prev - penaltyDamage));
    setPlayerInput([]); 
    setGameState('start');
    setAbility(null);

  }
  };


  return (
    <div className="game-container">
      {gameState === 'sequence' && (
          <div className="sequence-container">
          {sequenceState === "sequence" &&  <h2 className="sequence-title"> Remember the Sequence</h2>
          }
          {sequenceState === "player_input" &&  <h2 className="sequence-title">I hope you remembered... </h2>
          }
          {sequenceState === "success" &&  <h2 className="sequence-title">Perfect! </h2>
          }
          {sequenceState === "failed" &&  <h2 className="sequence-title">Failed </h2>
          }
          <div className="sequence-dots">
            {dots.map(dot => (
              <div
                key={dot.id}
                className={`sequence-dot ${activeDot === dot.id ? 'active' : ''}`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                onClick={() => handleDotClick(dot.id)}
              />
            ))}
          </div>
          </div>
        )}
      <div className='health-bars-container'>
        <HealthBar health={100} maxHealth={100} name="Meowric" />
        <HealthBar health={bosshealth} maxHealth={boss.health} name={boss.name} />
      </div>
      <div className='fight-container'>
        <div className='sprite-container'>
        <div className="meowric-container">
          <img src="meowric_sprite.png" className='meowric'/>
        </div>
        <div className="enemy-container">
          <img src={boss.sprite}  className='enemy'/>
        </div>
        </div>
      <div className='dialog-box'>
        {gameState === 'start' && (
          <p>Oh No... do something!</p>
        )}
        {gameState === 'abilities' && (
          <p>How will you fight?</p>
        )}
        {((gameState === 'abilities' || gameState === 'sequence') && ability !== null) && (
          <p>You  used {ability}</p>
        )}
      </div>
      </div>
      
      <div className='action-buttons'>  
        {
          gameState === 'start' && (
            <>
            <PixelButton
              label="Attack"
              onClick={() => setGameState('abilities')}
              color="#DD1A21"
            />
            <PixelButton
            label="Run"
            onClick={() => setGameState('abilities')}
            color="#6abc3a"
            />
            </>
          )
        }
        {
          gameState === 'abilities' && (
            <div className="abilities-container">
              <PixelButton
                label="Mighty Scratch"
                onClick={() => {  setAbility('Mighty Scratch'); startSequence('attack') }}
                color="#DD1A21"
              />
              <PixelButton
                label="Pawerful Pounce"
                onClick={() => {  setAbility('Pawerful Pounce');  startSequence('attack')}}
                color="#DD1A21"
              />
               <PixelButton
                label="Nutririous Milk"
                onClick={() => {  setAbility('Nutricious Milk'); startSequence('attack') }}
                color="#6abc3a"
              />
                <PixelButton
                label="Cancel"
                onClick={() => { setGameState('start'); }}
                color="#7C7C3C"
                />
            </div>
          )
        }
        {
          gameState === 'player_attack' && (
            <>
            </>
          )
        }    
      </div>
    </div>
  );
}

export default GameScreen;