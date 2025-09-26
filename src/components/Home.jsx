import { useState, useEffect, useCallback } from "react";
import FeedList from "./FeedList";
import "../styles/home.css";

function Home({ authUser, apiClient }) {
  const [createPostContent, setCreatePostContent] = useState("");
  const [feedCategory, setFeedCategory] = useState("global"); // global, following
  const [feedData, setFeedData] = useState({ feed: [], nextCursor: null });
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreatePost = async () => {
    if (!createPostContent.trim()) return;

    try {
      await apiClient.request("/post", { 
        method: "POST", 
        data: {
          content: createPostContent, 
        }
      });
      setCreatePostContent("");
      refreshFeed();
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Could not create post. Please try again.");
    }
  };

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

  const renderFeedContent = () => {
    if (isFeedLoading) {
      return <div>Loading feed...</div>;
    }
    if (error) {
      return <div className="error-container">Failed to load feed: {error.message}</div>;
    }
    if (feedData.length === 0) {
      return <div>No posts to show.</div>;
    }
    return <FeedList posts={feedData.feed} refreshFeed={refreshFeed} authUser={authUser} apiClient={apiClient} />;
  };

  // Update feed on feed category change
  useEffect(() => {
    if (!authUser) return;

    if (feedCategory === "global") {
      fetchGlobalFeed();
    } else if (feedCategory === "following") {
      fetchFollowingFeed();
    }
  }, [feedCategory, authUser, fetchGlobalFeed, fetchFollowingFeed]);

  if (isFeedLoading) return <div className="loading-container">Loading Dashboard...</div>;
  if (!authUser) {
    return <div className="error-container">Could not load user profile. Please try logging in again.</div>;
  }

  return (
    <div className="home">
      <div className="home-category">
        <div
          className={feedCategory === "global" ? "active" : ""}
          onClick={() => setFeedCategory("global")}
        >
          Global
        </div>
        <div
          className={feedCategory === "following" ? "active" : ""}
          onClick={() => setFeedCategory("following")}
        >
          Following
        </div>
      </div>
      <div className="home-compose">
        <div className="home-compose-avatar">{authUser.emoji}</div>
        <div className="home-compose-message">
          <textarea
            value={createPostContent}
            onChange={(e) => setCreatePostContent(e.target.value)}
            placeholder="What's on your mind?"
            minLength="1"
            maxLength="280"
          />
          <button onClick={handleCreatePost}>Submit</button>
        </div>
      </div>
      <div>{renderFeedContent()}</div>
    </div>
  );
}

export default Home;