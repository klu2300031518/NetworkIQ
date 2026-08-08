import "./../styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <div className="navbar-title">
        AI Inventory Optimization System
      </div>

      <div className="navbar-right">

        <input
          type="text"
          placeholder="Search..."
          className="search-box"
        />

      </div>

    </div>
  );
}

export default Navbar;