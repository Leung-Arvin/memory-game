import './boss-selection.css'

export default function BossSelection({onBossSelect}) {

  const handleBossSelection = (boss) => {
    onBossSelect(boss); 
  }

  return (
    <div className='boss-selection'>
      <h1>A couple of people are after your last life...
      Select one to deal with
      </h1>
      <div className="boss-select-options">
        <div className="card" onClick={() => handleBossSelection('william')}>
          <img src="pixel_arrow.png" className="arrow"/>
          <img src="william_sprite.png" className="william"/>
          <h2>Sir William, the hollow knight</h2>
          <p id="william">He doesn't seem to even want to fight</p>
        </div>
        <div className="card" onClick={() => handleBossSelection('rhaegal')}>
          <img src="pixel_arrow.png" className="arrow"/>
          <img src="rhaegal_selection.png"/>
          <h2>Rhaegal, the red moon</h2>
          <p id="rhaegal">Not easy but a chosen hero is supposed to defeat him</p>
        </div>
        <div className="card" onClick={() => handleBossSelection('vortal')}>
        <img src="pixel_arrow.png" className="arrow"/>
          <img src="vortal_sprite.png" className="vortal"/>
          <h2>Vortal, the untethered fate</h2>
          <p id="vortal">Fate always catches up... </p>
        </div>
      </div>
    </div>
  );
}