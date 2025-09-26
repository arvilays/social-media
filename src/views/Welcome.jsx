import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function Welcome() {
  const [isLoginView, setIsLoginView] = useState(true);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    navigate("/home");
  };

  // Navigate to home if token already exists
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <>
      <AuthForm
        isLogin={isLoginView}
        apiClient={apiClient}
        onAuthSuccess={handleAuthSuccess}
      />
      <button onClick={() => setIsLoginView(!isLoginView) }>Switch</button>
    </>
  )
}

export default Welcome;