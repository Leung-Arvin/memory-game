export default function HealthBar({ health, maxHealth }) {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="health-bar">
      <div
        className="health-bar-fill"
        style={{ width: `${healthPercentage}%` }}
      ></div>
    </div>
  );
}