import { useState, useEffect, useCallback } from "react";
import FeedList from "./FeedList";

function Profile({ username, authUser, apiClient }) {
  const [user, setUser] = useState(null);
  const [feedCategory, setFeedCategory] = useState("posts"); // posts, likes
  const [feedData, setFeedData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async() => {
    try {
      const response = await apiClient.request(`/user/${username}`);
      setUser(response);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Could not fetch user info.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchUserPosts = useCallback(async (cursor) => {
    setIsFeedLoading(true);
    setError(null);
    try {
      const url = cursor ? `/feed/${username}/posts?cursor=${cursor}` : `/feed/${username}/posts`;
      const response = await apiClient.request(url);
      setFeedData(response);
    } catch (err) {
      console.error("Failed to fetch user's posts feed:", err);
      setError(err);
    } finally {
      setIsFeedLoading(false);
    }
  }, [apiClient, username]);

  const fetchUserLikes = useCallback(async (cursor) => {
    setIsFeedLoading(true);
    setError(null);
    try {
      const url = cursor ? `/feed/${username}/likes?cursor=${cursor}` : `/feed/${username}/likes`;
      const response = await apiClient.request(url);
      setFeedData(response);
    } catch (err) {
      console.error("Failed to fetch user's likes feed:", err);
      setError(err);
    } finally {
      setIsFeedLoading(false);
    }
  }, [apiClient, username]);

  const refreshFeed = useCallback(() => {
    if (feedCategory === "posts") {
      fetchUserPosts();
    } else {
      fetchUserLikes();
    }
  }, [feedCategory, fetchUserPosts, fetchUserLikes]);
  
  const renderPosts = () => {
    if (isFeedLoading) return <>Loading Posts...</>;

    if (!Array.isArray(feedData.feed) || feedData.feed.length === 0) {
      return <div>This user has no posts yet.</div>;
    }

    return <FeedList posts={feedData.feed} refreshFeed={refreshFeed} authUser={authUser} apiClient={apiClient} />
  };

  useEffect(() => {
    if (username) {
      fetchUser();
      setFeedCategory("posts");
    }
  }, [username]);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  if (isPageLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>
  if (!user) return <div>No user found.</div>;

  return (
    <div>
      <div>{user.display_name}'s Profile</div>
      <div>@{user.username}</div>
      <div>{user.emoji}</div>
      <div>
        <div
          className={feedCategory === "posts" ? "active" : ""}
          onClick={() => setFeedCategory("posts")}
        >
          Posts
        </div>
        <div
          className={feedCategory === "likes" ? "active" : ""}
          onClick={() => setFeedCategory("likes")}
        >
          Likes
        </div>
      </div>
      <div>
        {renderPosts()}
      </div>
    </div>
  )
}

export default Profile;