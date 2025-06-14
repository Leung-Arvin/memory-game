import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [frame, setFrame] = useState(0);
  const [playerhealth, setPlayerHealth] = useState(100);
  const [bosshealth, setBossHealth] = useState(100);
  const [sequenceActive, setSequenceActive] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [sequencePattern, setSequencePattern] = useState([]);
  const [currentSequenceStep, setCurrentSequenceStep] = useState(0);
  const [currentAction, setCurrentAction] = useState(null);
  const [sequenceResult, setSequenceResult] = useState(null);
  const [damageModifier, setDamageModifier] = useState(1);
  
  const shapes = {
    triangle: [[50, 10], [20, 90], [80, 90]],
    square: [[20, 20], [20, 80], [80, 80], [80, 20]],
    star: [[50, 10], [30, 90], [80, 30], [20, 30], [70, 90]]
  };

  const maxHealth = 100;
  const frameCount = 4;
  const fps = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % frameCount);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  useEffect(() => {
    if (!showPattern || !sequenceActive) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= sequencePattern.length) {
        clearInterval(interval);
        return;
      }
      
      // This will trigger the flash animation through CSS
      const dots = document.querySelectorAll('.sequence-dot');
      dots[currentIndex].classList.add('flashing');
      
      setTimeout(() => {
        dots[currentIndex].classList.remove('flashing');
      }, 500);
      
      currentIndex++;
    }, 1000);

    return () => clearInterval(interval);
  }, [showPattern, sequenceActive, sequencePattern]);

  const generateSequence = () => {
    const shapeTypes = Object.keys(shapes);
    const randomShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const pattern = shapes[randomShape];

    setSequencePattern(pattern);
    setCurrentSequenceStep(0);
    setSequenceActive(true);
    setShowPattern(true);

    setTimeout(() => {
      setShowPattern(false);
    }, pattern.length * 1000);
  }

  const handlePlayerAction = (action) => {
    generateSequence();
    setCurrentAction(action);
  }

  const handleSequenceClick = (index) => {
    if (!sequenceActive || showPattern) return;

    const expectedPosition = sequencePattern[currentSequenceStep];
    const clickedPosition = sequencePattern[index];

    if (clickedPosition[0] === expectedPosition[0] && 
      clickedPosition[1] === expectedPosition[1]) {
    const nextStep = currentSequenceStep + 1;
    setCurrentSequenceStep(nextStep);
    
    if (nextStep === sequencePattern.length) {
      const modifier = 1 + (0.5 * sequencePattern.length);
      setDamageModifier(modifier);
      setSequenceResult('success');
      setTimeout(() => {
        setSequenceActive(false);
        executePlayerActionWithModifier(currentAction);
      }, 1000);
    }
  } else {
    setDamageModifier(0.5);
    setSequenceResult('fail');
    setTimeout(() => {
      setSequenceActive(false);
      executePlayerActionWithModifier(currentAction);
    }, 1000);
  }
  }

  const executePlayerActionWithModifier = () => {
    if (currentAction === 'attack') {
      const damage = 4 * damageModifier;
      setBossHealth(prev => Math.max(0, prev - damage));
      
    } else if (currentAction === 'heal') {
      const healing = 15 * damageModifier;
      setPlayerHealth(prev => Math.min(100, prev + healing));
    }

    setSequenceResult(null);
  };


  const heal = () => setPlayerHealth(prev => Math.min(maxHealth, prev + 10));

  return (
    <div className="game-container">

      <div className="enemy-container">
        <div className="boss-health-bar-container">
            <div 
              className="boss-health-bar-fill"
              style={{ width: `${(bosshealth / maxHealth) * 100}%` }}
            />
            <span className="boss-health-text">Rhaegal, The Self Devouring</span>
          </div>
        <img className='enemy_sprite' src='/rhaegal_sprite.png'/>
        
      </div>


      <div className="player-hud-container">

        <div className="player-icon">
          <div 
            className="character-sprite"
            style={{ backgroundPosition: `0 -${frame * 25}px` }}
          />
          <div className="health-bar-container">
            <div 
              className="health-bar-fill"
              style={{ width: `${(playerhealth / maxHealth) * 100}%` }}
            />
            <span className="health-text">{playerhealth}/{maxHealth}</span>
          </div>
        </div>


        <div className="beginning-action-container">

            <button className="attack" onClick={() => handlePlayerAction('attack')}>Fight</button>
            <button className="run" onClick={() => handlePlayerAction('heal')}>Heal</button>
        </div>
      </div>
      {sequenceActive && (
        <div className="sequence-overlay">
          <div className="sequence-instruction">
            {showPattern ? "Watch the sequence!" : 
             sequenceResult === null ? "Repeat the sequence!" : 
             sequenceResult === 'success' ? "Success!" : "Failed!"}
          </div>
          <div className="sequence-shape">
            {sequencePattern.map((point, index) => (
              <div
                key={index}
                className={`sequence-dot ${currentSequenceStep > index ? 'activated' : ''}`}
                style={{
                  left: `${point[0]}%`,
                  top: `${point[1]}%`,
                  animationDelay: `${index * 0.5}s`
                }}
                onClick={() => handleSequenceClick(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;