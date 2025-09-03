import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <div onClick={() => navigate("/home")}>Logo</div>
        <div onClick={() => navigate("/home")}>Home</div>
        <div onClick={() => navigate("/explore")}>Explore</div>
        <div onClick={() => navigate("/bookmarks")}>Bookmarks</div>
      </div>
  
      <div
        className="sidebar-profile"
        onClick={handleLogout}
      >
        {user.username}
      </div>
    </div>
  );
}

export default Sidebar;