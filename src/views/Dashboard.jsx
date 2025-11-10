import { useEffect, useCallback, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Home } from "../components/Home";
import { Post } from "../components/Post";
import { Profile } from "../components/Profile";
import { Explore } from "../components/Explore";
import { Bookmarks } from "../components/Bookmarks";
import { Settings } from "../components/Settings";
import { useAuth } from "../hooks/useAuth";
import LoadingMessage from "../components/common/LoadingMessage";
import "../styles/dashboard.css";

export const Dashboard = ({ currentView = "home" }) => {
  const { apiClient, token, setToken } = useOutletContext();
  const { authUser, isLoading, fetchAuthUser, clearAuth } = useAuth(apiClient);
  const { username, postId } = useParams();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const handleLogout = useCallback(() => {
    clearAuth();
    setToken(null);
    navigate("/");
  }, [clearAuth, setToken, navigate]);

  // Only fetch user data if a token exists
  useEffect(() => {
    if (!token || hasFetched.current) return;
    hasFetched.current = true;

    fetchAuthUser().catch(() => {
      handleLogout();
    });
  }, [token, fetchAuthUser, handleLogout]);

  if (!apiClient || (isLoading && token)) return <LoadingMessage />;

  const isAuthenticated = !!authUser;

  const views = {
    home: <Home authUser={authUser} apiClient={apiClient} />,
    post: <Post postId={postId} authUser={authUser} apiClient={apiClient} />,
    profile: <Profile username={username} authUser={authUser} apiClient={apiClient} />,
    explore: <Explore apiClient={apiClient} authUser={authUser} />,
    bookmarks: isAuthenticated
      ? <Bookmarks authUser={authUser} apiClient={apiClient} />
      : <div className="dashboard-unauthorized">Please log in to view your bookmarks.</div>,
    settings: isAuthenticated
      ? <Settings authUser={authUser} apiClient={apiClient} />
      : <div className="dashboard-unauthorized">Log in to manage your settings.</div>,
  };

  const renderView = views[currentView] || views.home;

  return (
    <div className="dashboard-container">
      <Sidebar
        authUser={authUser}
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      <div className="dashboard-main">{renderView}</div>
    </div>
  );
};

export default Dashboard;
