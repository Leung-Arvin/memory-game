import "../styles/healthbar.css";

export default function HealthBar({ health, maxHealth, name = "Meowric" }) {
  const clampedHealth = Math.max(0, Math.min(health, maxHealth));
  const healthPercentage = (clampedHealth / maxHealth) * 100;

  let healthColor;
  if (healthPercentage > 70) {
    healthColor = "#F60000";
  } else if (healthPercentage > 30) {
    healthColor = "#F44336";
  } else {
    healthColor = "#FFC107";
  }

  return (
    <div className="health-bar-container">
      {name === "Meowric" ? (
        <div className="health-bar-info">
          <span className="health-label">{name}</span>
          <span className="health-value">
            {clampedHealth}/{maxHealth}
          </span>
        </div>
      ) : (
        <div className="health-bar-info">
          <span className="health-value">
            {clampedHealth}/{maxHealth}
          </span>
          <span className="health-label">{name}</span>
        </div>
      )}
      <div className="health-bar">
        <div
          className="health-bar-fill"
          style={{
            width: `${healthPercentage}%`,
            backgroundColor: healthColor,
          }}
        ></div>
      </div>
    </div>
  );
}
