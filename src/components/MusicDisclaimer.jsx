import PixelButton from "./common/PixelButton";
import "./styles/disclaimer.css"

export default function MusicDisclaimer({onAccept, onDecline}) {
  return (
    <div className="disclaimer-container">
      <h1>
        Disclaimer: This game is best experienced with music
      </h1>
      <PixelButton label="Allow Music" color="#6abc3a" onClick={() => onAccept()} />
      <PixelButton label="Continue without Music" color="#DD1A21" onClick={() => onDecline()}/>
        <p>Press esc key to change sound settings</p>
    </div>
  );
}