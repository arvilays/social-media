import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import homeImage from "../assets/home.svg";
import profileImage from "../assets/account-circle.svg";
import exploreImage from "../assets/magnify.svg";
import bookmarksImage from "../assets/bookmark-multiple.svg";
import settingsImage from "../assets/cog.svg";
import "../styles/sidebar.css";

export const Sidebar = ({ authUser, handleLogout }) => {
  const isAuthenticated = !!authUser;

  const navItems = [
    { label: "", path: "/home", icon: logoImage },
    { label: "Home", path: "/home", icon: homeImage },
    { label: "Explore", path: "/explore", icon: exploreImage },
    ...(isAuthenticated
      ? [
        { label: "Profile", path: `/user/${authUser.username}`, icon: profileImage },
        { label: "Bookmarks", path: "/bookmarks", icon: bookmarksImage },
        { label: "Settings", path: "/settings", icon: settingsImage },
      ]
      : []),
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.label || "logo"}
            to={item.path}
            className="sidebar-link"
          >
            <img
              className="sidebar-icon"
              src={item.icon}
              alt={item.label || "logo"}
            />
            {item.label && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="sidebar-auth">
        <div className="sidebar-auth-emoji">{authUser?.emoji || "👤"}</div>
        <div className="sidebar-auth-username">
          {authUser?.username ? `@${authUser.username}` : "Guest"}
        </div>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="sidebar-auth-logout"
          >
            logout
          </button>
        ) : (
          <Link to="/" className="sidebar-auth-logout">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
