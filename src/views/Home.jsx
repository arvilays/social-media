import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Profile from "../components/Profile";
import "../styles/home.css";

function Home({ currentView = "feed" }) {
  const [self, setSelf] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const { username } = useParams();

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const fetchSelf = useCallback(async () => {
    try {
      const response = await apiClient.request("/users/me");
      setSelf(response);
    } catch (err) {
      handleLogout();
    } finally {
      setIsPageLoading(false);
    }
  }, [apiClient, handleLogout]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "profile":
        return (
          <Profile
            username={username} 
            apiClient={apiClient}
          /> 
        );
      case "feed":
      default:
        return (
          <Feed
            user={self}
            apiClient={apiClient}
          />
        );
    }
  };

  // Initial load
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchSelf();
  }, [token, navigate, fetchSelf]);

  if (isPageLoading) return <>Loading</>;

  return (
    <div className="home-container">
      <Sidebar
        user={self}
        handleLogout={handleLogout}
      />

      <div className="main-container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default Home;

