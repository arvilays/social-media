import { useState } from "react";
import "../styles/feed.css";

function Feed({
  user,
  feedData,
  isFeedLoading,
  error,
  feedCategory,
  setFeedCategory,
  onPostCreated,
  apiClient,
}) {
  const [createPostContent, setCreatePostContent] = useState("");

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
      onPostCreated(); // Refresh the feed after posting
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Could not create post. Please try again.");
    }
  };

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
    return feedData.map((post) => (
      <div key={post.id} className="post">
        <div className="post-author">{post.author.username}</div>
        <div className="post-content">{post.content}</div>
      </div>
    ));
  };

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
        <div className="feed-compose-avatar">Icon</div>
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
      <div className="feed-posts">{renderFeedContent()}</div>
    </div>
  );
}

export default Feed;