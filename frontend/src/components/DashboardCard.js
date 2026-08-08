import "./../styles/Card.css";

function DashboardCard({ icon, title, value, color, onClick }) {
  return (
    <div
      className="card"
      style={{ borderLeft: `6px solid ${color}` }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>{value}</h2>
          <h3>{title}</h3>
        </div>

        <div
          style={{
            fontSize: "45px",
            color: color,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;