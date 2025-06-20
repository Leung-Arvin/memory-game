import HealthBar from './common/HealthBar';
import PixelButton from './common/PixelButton';
import './styles/fight.css';
import React, { useState, useEffect } from 'react';

function GameScreen({boss, onRun}) {
  const [gameState, setGameState] = useState('start'); 
  const [ability, setAbility] = useState(null);
  const [playerhealth, setPlayerHealth] = useState(100);
  const [bosshealth, setBossHealth] = useState(boss.health);
  const [sequence, setSequence] = useState([]);
  const [sequenceState, setSequenceState] = useState(''); // 'sequence', 'player_input'
  const [playerInput, setPlayerInput] = useState([]);
  const [dodgeSequence, setDodgeSequence] = useState(false);
  const [enemyDamage, setEnemyDamage] = useState(0);
  const [dots, setDots] = useState([]);
  const [activeDot, setActiveDot] = useState(null);
  const [clickedDots, setClickedDots] = useState([]);

  const generateDots = () => {
    const newDots = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      active: false
    }));
    setDots(newDots);
    setClickedDots([]);
    return newDots;
  }

  const startSequence = (ability, isDodge = false) => {
    const newDots = generateDots();
    const newSequence = newDots.sort(() => 0.5 - Math.random()).slice(0, 5);

    setSequence(newSequence);
    setSequenceState('sequence');
    setPlayerInput([]);
    setDodgeSequence(isDodge);
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
    setClickedDots([...clickedDots, dotId]); // Add clicked dot to the array
    
    // Check if the current input matches the sequence up to this point
    const isCorrectSoFar = newInput.every((inputDot, i) => inputDot === sequence[i].id);

    if (isCorrectSoFar) {
      if (!dodgeSequence) {
        if (ability === 'Mighty Scratch' || ability === 'Pawerful Pounce') {
          const baseDamage = 15; 
          const damage = baseDamage * newInput.length; 

          if (newInput.length === sequence.length) {
            setSequenceState('success');
            setTimeout(() => {
              setClickedDots([]);
              setBossHealth(prev => Math.max(0, prev - damage));
              setAbility(null);
              setGameState('enemy_attack');
              setSequenceState('');
            }, 1000);
          }
        } else if (ability === 'Nutritious Milk') {

          const baseHeal = 5;
          const healAmount = baseHeal * newInput.length;

          if (newInput.length === sequence.length) {
            setSequenceState('success');
            setTimeout(() => {
              setClickedDots([]);
              setPlayerHealth(prev => Math.min(100, prev + healAmount));
              setAbility(null);
              setGameState('enemy_attack');
              setSequenceState('');
            }, 1000);
          }
        }
      } else {
        // Dodge sequence success
        if (newInput.length === sequence.length) {
          setSequenceState('dodge_success');
          setTimeout(() => {
            setClickedDots([]);
            setAbility(null);
            setDodgeSequence(false);
            setGameState('start');
            setSequenceState('');
          }, 1000);
        }
      }
    } else {
      if (!dodgeSequence) {
        setSequenceState('failed');
        setTimeout(() => {
          setClickedDots([]);
          const penaltyDamage = 5; 
          setBossHealth(prev => Math.max(0, prev - penaltyDamage));
          setPlayerInput([]); 
          setGameState('enemy_attack');
          setSequenceState('');
          setAbility(null);
        }, 1000);
      } else {
        // Failed dodge sequence
        setSequenceState('dodge_failed');
        setTimeout(() => {
          setClickedDots([]);
          setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
          setDodgeSequence(false);
          setGameState('start');
          setSequenceState('');
          setPlayerInput([]);
        }, 1000);
      }
    }
  };

  const enemyAttack = () => {
    const damage = Math.floor(Math.random() * 15) + 10; // Random damage between 10-25
    setEnemyDamage(damage); // Store damage for dodge sequence
    
    // Start dodge sequence instead of immediately applying damage
    startSequence(null, true);
  };

  // Trigger enemy attack after player's turn
  useEffect(() => {
    if (gameState === 'enemy_attack') {
      const timer = setTimeout(() => {
        enemyAttack();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (bosshealth <= 0) {
      setSequenceState('');
      setClickedDots([]);
      setGameState('enemy_vanquished');
    }
  }, [bosshealth]);
  
  // Check for defeat (player defeated)
  useEffect(() => {
    if (playerhealth <= 0) {
      setGameState('player_lost');
    }
  }, [playerhealth]);

  const returnToBossMenu = () => {
    if (gameState === "enemy_vanquished" || gameState ===  "player_lost") {
        onRun();
    }
  }
  return (
    <div className="game-container" onClick={returnToBossMenu}>
      {(gameState === 'sequence' || sequenceState === 'success' || sequenceState === 'failed' || 
        sequenceState === 'dodge_success' || sequenceState === 'dodge_failed') && (
        <div className="sequence-container">
          {sequenceState === "sequence" && (
            <h2 className="sequence-title">
              {dodgeSequence ? "Dodge! Remember the sequence!" : "Remember the Sequence"}
            </h2>
          )}
          {sequenceState === "player_input" && (
            <h2 className="sequence-title">
              {dodgeSequence ? "Quick! Repeat the sequence to dodge!" : "I hope you remembered..."}
            </h2>
          )}
          {sequenceState === "success" && <h2 className="sequence-title">Perfect! </h2>}
          {sequenceState === "failed" && <h2 className="sequence-title">Failed </h2>}
          {sequenceState === "dodge_success" && <h2 className="sequence-title">Dodged! </h2>}
          {sequenceState === "dodge_failed" && <h2 className="sequence-title">Ouch! </h2>}

          <div className="sequence-dots">
            {dots.map(dot => (
              <div
                key={dot.id}
                className={`sequence-dot ${
                  activeDot === dot.id ? 'active' : 
                  clickedDots.includes(dot.id) ? 'clicked' : ''
                }`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                onClick={() => handleDotClick(dot.id)}
              />
            ))}
          </div>
        </div>
      )}

      {(gameState === 'enemy_vanquished' || gameState === 'player_lost') && (
      <div className="outcome-screen">
        <div className="outcome-content">
          {gameState === "enemy_vanquished" && (
            <>
              <h1>Enemy Vanquished</h1>
              <h2>Click to find your next opponent</h2>
            </>
          )}
          {gameState === "player_lost" && (
            <>
              <h1>You've lost</h1>
              <h2>Don't give up! Keep on fighting</h2>
            </>
          )}
        </div>
      </div>
        )}
      <div className='health-bars-container'>
        <HealthBar health={playerhealth} maxHealth={100} name="Meowric" />
        <HealthBar health={bosshealth} maxHealth={boss.health} name={boss.name} />
      </div>
      <div className='fight-container' style={{backgroundImage: `url(${boss.backgroundImage})`}}>
        <div className='sprite-container'>
        <div className="meowric-container">
        { gameState !== 'player_lost' &&
          <img src="meowric_sprite.png" className='meowric'/>
        }
        </div>
        <div className="enemy-container">
          { gameState !== 'enemy_vanquished' &&
            <img src={boss.sprite} className={`${boss.className}`} />
          }
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
        {(gameState === 'enemy_attack' || dodgeSequence) && (
          <p>{boss.name} used {boss.moves[0]}</p>
        )}
        {gameState === 'running' && (
          <div className="dialog-box">
            <p>Got away safely!</p>
          </div>
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
            onClick={onRun}
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
                label="Nutritious Milk"
                onClick={() => {  setAbility('Nutritious Milk'); startSequence('heal') }}
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