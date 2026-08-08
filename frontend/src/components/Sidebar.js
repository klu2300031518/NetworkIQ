import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>NetworkIQ</h2>

      <hr />

      <p>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>
      </p>

      <p>
        <Link to="/inventory" style={{ color: "white", textDecoration: "none" }}>
          Inventory
        </Link>
      </p>

      <p>
        <Link
          to="/recommendation"
          style={{ color: "white", textDecoration: "none" }}
        >
          AI Recommendation
        </Link>
      </p>

      <p>
        <Link
          to="/analytics"
          style={{ color: "white", textDecoration: "none" }}
        >
          Analytics
        </Link>
      </p>

      <p>
        <Link to="/reports" style={{ color: "white", textDecoration: "none" }}>
          Reports
        </Link>
      </p>
    </div>
  );
}

export default Sidebar;