import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import "../styles/home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [feedCategory, setFeedCategory] = useState("global");
  const [feedData, setFeedData] = useState({ feed: [], nextCursor: null });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apiClient, token, setToken } = useOutletContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setToken(null);
    navigate("/");
  }, [setToken, navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.request("/users/me");
      setUser(response);
    } catch (err) {
      handleLogout();
    } finally {
      setIsPageLoading(false);
    }
  }, [apiClient, handleLogout]);

  const fetchGlobalFeed = useCallback(async (cursor) => {
    setIsFeedLoading(true);
    setError(null);
    try {
      const url = cursor ? `/feed/global?cursor=${cursor}` : '/feed/global';
      const response = await apiClient.request(url);
      setFeedData(response);
    } catch (err) {
      console.error("Failed to fetch global feed:", err);
      setError(err); 
    } finally {
      setIsFeedLoading(false);
    }
  }, [apiClient]);

  const fetchFollowingFeed = useCallback(async (cursor) => {
    setIsFeedLoading(true);
    setError(null);
    try {
      const url = cursor ? `/feed/following?cursor=${cursor}` : '/feed/following';
      const response = await apiClient.request(url);
      setFeedData(response);
    } catch (err) {
      console.error("Failed to fetch following feed:", err);
      setError(err); 
    } finally {
      setIsFeedLoading(false);
    }
  }, [apiClient]); 

  const refreshFeed = useCallback(() => {
    if (feedCategory === "global") {
      fetchGlobalFeed();
    } else {
      fetchFollowingFeed();
    }
  }, [feedCategory, fetchGlobalFeed, fetchFollowingFeed]);

  // TODO:
  // FETCH GLOBAL FEED (DEFAULT)
  // FETCH FOLLOWING FEED IF REQUESTED
  // ENABLE REPLIES

  // Initial load
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchUser();
  }, [token, navigate, fetchUser]);

  // Update feed on feed category change
  useEffect(() => {
    if (!user) return;

    if (feedCategory === "global") {
      fetchGlobalFeed();
    } else if (feedCategory === "following") {
      fetchFollowingFeed();
    }
  }, [feedCategory, user, fetchGlobalFeed, fetchFollowingFeed]);

  if (isPageLoading) return <div className="loading-container">Loading Dashboard...</div>;
  if (!user) {
    return <div className="error-container">Could not load user profile. Please try logging in again.</div>;
  }

  return (
    <div className="home-container">
      <Sidebar
        user={user}
        handleLogout={handleLogout}
      />
      <Feed 
        user={user}
        feedData={feedData.feed} 
        isFeedLoading={isFeedLoading}
        error={error}
        feedCategory={feedCategory}
        setFeedCategory={setFeedCategory} 
        onPostCreated={refreshFeed} 
        apiClient={apiClient}
      />
    </div>
  );
}

export default Home;

