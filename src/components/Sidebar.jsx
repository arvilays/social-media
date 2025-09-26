import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ authUser, handleLogout }) {
  const navItems = [
    { label: "Logo", path: "/home" },
    { label: "Home", path: "/home" },
    { label: "Profile", path: `/user/${authUser.username}` },
    { label: "Explore", path: "/explore" },
    { label: "Bookmarks", path: "/bookmarks" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <div>
          {navItems.map((item) => (
            <div key={item.label}>
              <Link to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-profile">
        <div>{authUser.username}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;
