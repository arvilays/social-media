import { useState } from "react";
import { ErrorMessage } from "./common/ErrorMessage";
import "../styles/authForm.css";

export const AuthForm = ({ isLogin, apiClient, onAuthSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.target).entries());

    if (!isLogin && data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await apiClient.request("/login", {
          method: "POST",
          data,
        });
        onAuthSuccess(response.token);
      } else {
        await apiClient.request("/signup", {
          method: "POST",
          data,
        });

        const loginResponse = await apiClient.request("/login", {
          method: "POST",
          data: { username: data.username, password: data.password },
        });
        onAuthSuccess(loginResponse.token);
      }

      e.target.reset();
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="username"
          required
          minLength={4}
          maxLength={15}
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          required
          minLength={3}
          disabled={loading}
        />

        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            required
            minLength={3}
            disabled={loading}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "processing..." : isLogin ? "login" : "create account"}
        </button>

        {error && <ErrorMessage message={error} />}
      </form>
    </div>
  );
};

export default AuthForm;
