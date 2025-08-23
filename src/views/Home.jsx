import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
//import AuthForm from "../components/AuthForm";
//import "../styles/home.css";

function Home() {
  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    // navigate("/dashboard");
  };

  // Navigate to dashboard if token already exists
  // useEffect(() => {
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, [token, navigate]);

  return (
    <>
      <div className="home-container">
        {/* <AuthForm
          isLogin={isLoginView}
          apiClient={apiClient}
          onAuthSuccess={handleAuthSuccess}
        /> */}
      </div>
    </>
  );
}

export default Home;