import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import Profile from "../components/Profile";
import "../styles/dashboard.css";

function Dashboard({ currentView = "home" }) {
  const [authUser, setAuthUser] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const { username } = useParams();

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const fetchAuthUser = useCallback(async () => {
    try {
      const response = await apiClient.request("/user/me");
      setAuthUser(response);
    } catch {
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
            authUser={authUser}
            apiClient={apiClient}
          /> 
        );
      case "home":
      default:
        return (
          <Home
            authUser={authUser}
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

    fetchAuthUser();
  }, [token, navigate, fetchAuthUser]);

  if (isPageLoading) return <>Loading</>;

  return (
    <div className="dashboard-container">
      <Sidebar
        authUser={authUser}
        handleLogout={handleLogout}
      />

      <div className="main-container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default Dashboard;

