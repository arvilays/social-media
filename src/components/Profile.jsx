import { useState, useEffect } from "react";
import PostsList from "./PostsList";

function Profile({ username, apiClient }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("posts"); // posts, likes
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async() => {
    try {
      const response = await apiClient.request(`/users/${username}`);
      setUser(response);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Could not fetch user info.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchUserPosts = async() => {
    try {
      const response = await apiClient.request(`/users/${username}/posts`);
      setPosts(response.feed);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      setError("Could not fetch user's posts.");
    } finally {
      setIsPostLoading(false);
    }
  }

  const renderPosts = () => {
    if (isPostLoading) return <>Loading Posts...</>;

    if (!Array.isArray(posts) || posts.length === 0) {
      return <div>This user has no posts yet.</div>;
    }

    return <PostsList posts={posts} />
  };

  useEffect(() => {
    if (username) {
      fetchUser();
      fetchUserPosts();
    }
  }, [username]);

  if (isPageLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>
  if (!user) return <div>No user found.</div>;

  return (
    <div>
      <div>{user.display_name}'s Profile</div>
      <div>@{user.username}</div>
      <div>{user.emoji}</div>
      <div>
        <div>Posts</div>
        <div>Likes</div>
      </div>
      <div>
        {renderPosts()}
      </div>
    </div>
  )
}

export default Profile;