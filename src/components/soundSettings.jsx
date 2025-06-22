// components/SoundSettings.js
import { useState, useEffect } from 'react';
import PixelButton from './common/PixelButton';
import './styles/sound-settings.css';

export default function SoundSettings({ 
  isVisible, 
  onClose,
  musicEnabled,
  setMusicEnabled,
  soundEffectsEnabled,
  setSoundEffectsEnabled,
  musicVolume,
  setMusicVolume,
  effectsVolume,
  setEffectsVolume
}) {
  const [localMusicVolume, setLocalMusicVolume] = useState(musicVolume);
  const [localEffectsVolume, setLocalEffectsVolume] = useState(effectsVolume);

  // Update global volumes when local values change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMusicVolume(localMusicVolume);
      setEffectsVolume(localEffectsVolume);
    }, 100);
    return () => clearTimeout(timer);
  }, [localMusicVolume, localEffectsVolume]);

  if (!isVisible) return null;

  return (
    <div className="sound-settings-overlay">
      <div className="sound-settings-container">
        <h2>Sound Settings</h2>
        
        <div className="sound-option">
          <label>
            <input 
              type="checkbox" 
              checked={musicEnabled}
              onChange={(e) => setMusicEnabled(e.target.checked)}
            />
            Background Music
          </label>
          <input
            type="range"
            min="0" 
            max="1" 
            step="0.01"
            value={localMusicVolume}
            onChange={(e) => setLocalMusicVolume(parseFloat(e.target.value))}
            disabled={!musicEnabled}
          />
        </div>

        <div className="sound-option">
          <label>
            <input 
              type="checkbox" 
              checked={soundEffectsEnabled}
              onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
            />
            Sound Effects
          </label>
          <input
            type="range"
            min="0" 
            max="1" 
            step="0.01"
            value={localEffectsVolume}
            onChange={(e) => setLocalEffectsVolume(parseFloat(e.target.value))}
            disabled={!soundEffectsEnabled}
          />
        </div>

        <PixelButton 
          label="Close" 
          onClick={onClose} 
          color="#7C7C3C" 
        />
      </div>
    </div>
  );
}