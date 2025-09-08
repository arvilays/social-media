import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ user, handleLogout }) {
  const navItems = [
    { label: "Logo", path: "/home" },
    { label: "Home", path: "/home" },
    { label: "Profile", path: `/user/${user.username}` },
    { label: "Explore", path: "/explore" },
    { label: "Bookmarks", path: "/bookmarks" }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-profile">
        <span>{user.username}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
