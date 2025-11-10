import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LoadingMessage } from "./common/LoadingMessage";
import "../styles/explore.css";

const UserCard = ({ user }) => (
  <Link to={`/user/${user.username}`} className="user-card-link">
    <div className="user-card">
      <div className="user-card-emoji">{user.emoji || "👤"}</div>
      <div className="user-card-info">
        <span className="user-card-display-name">
          {user.display_name || user.username}
        </span>
        <span className="user-card-username">@{user.username}</span>
      </div>
    </div>
  </Link>
);

export const Explore = ({ apiClient }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const latestQueryRef = useRef("");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timerId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      latestQueryRef.current = query;

      try {
        const users = await apiClient.request(
          `/user/search?q=${encodeURIComponent(query)}`
        );

        if (latestQueryRef.current === query) {
          setResults(users || []);
        }
      } catch (err) {
        console.error("Failed to search for users:", err);
        if (latestQueryRef.current === query) {
          setResults([]);
          setError("Could not fetch search results. Please try again.");
        }
      } finally {
        if (latestQueryRef.current === query) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [query, apiClient]);

  useEffect(() => {
    document.title = "explore · stellr";
  }, []);

  const renderContent = () => {
    if (isLoading) return <LoadingMessage />;
    if (error) return <div className="explore-message error">{error}</div>;
    if (results.length > 0) return results.map((user) => <UserCard key={user.id} user={user} />);
    if (query.trim()) return <div className="explore-message">No users found for "{query}".</div>;
    return <div className="explore-message">Search for users by username or display name.</div>;
  };

  return (
    <div className="explore-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a user..."
        className="explore-search-input"
      />
      <div className="explore-users">{renderContent()}</div>
    </div>
  );
};

export default Explore;
