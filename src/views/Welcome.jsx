import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import logoImage from "../assets/logo.png";
import "../styles/welcome.css";

export const Welcome = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    navigate("/home");
  };

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = "stellr";
  }, []);

  const handleGuestAccess = () => {
    navigate("/home");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <div className="welcome-header-logo">
          <img src={logoImage} alt="stellr" />
        </div>
        <div className="welcome-header-title">stellr</div>
        <div className="welcome-header-subtitle">incoming transmission: new connections await.<span class="typing-cursor"></span></div>
      </div>

      <hr />

      <AuthForm
        isLogin={isLoginView}
        apiClient={apiClient}
        onAuthSuccess={handleAuthSuccess}
      />

      <hr />

      <button
        className="welcome-auth-switch"
        onClick={() => setIsLoginView(!isLoginView)}
      >
        {isLoginView
          ? "need an account? sign up"
          : "already have an account? log in"}
      </button>

      <div className="welcome-guest">
        <button className="welcome-guest-button" onClick={handleGuestAccess}>
          guest mode
        </button>
      </div>
    </div>
  );
};

export default Welcome;
