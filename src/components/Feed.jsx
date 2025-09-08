import { useState, useEffect, useCallback } from "react";
import PostsList from "./PostsList";
import "../styles/feed.css";

function Feed({ user, apiClient }) {
  const [createPostContent, setCreatePostContent] = useState("");
  const [feedCategory, setFeedCategory] = useState("global");
  const [feedData, setFeedData] = useState({ feed: [], nextCursor: null });
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreatePost = async () => {
    if (!createPostContent.trim()) return;

    try {
      await apiClient.request("/posts", { 
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
    return <PostsList posts={feedData.feed} />;
  };

  // Update feed on feed category change
  useEffect(() => {
    if (!user) return;

    if (feedCategory === "global") {
      fetchGlobalFeed();
    } else if (feedCategory === "following") {
      fetchFollowingFeed();
    }
  }, [feedCategory, user, fetchGlobalFeed, fetchFollowingFeed]);

  if (isFeedLoading) return <div className="loading-container">Loading Dashboard...</div>;
  if (!user) {
    return <div className="error-container">Could not load user profile. Please try logging in again.</div>;
  }

  return (
    <div className="feed">
      <div className="feed-category">
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
      <div className="feed-compose">
        <div className="feed-compose-avatar">{user.emoji}</div>
        <div className="feed-compose-message">
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

export default Feed;