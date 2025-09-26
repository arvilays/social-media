import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/postItem.css";

function PostItem({ post, refreshFeed, authUser, apiClient }) {
  // Post and reposts have different nesting structures.
  const originalPost = post.type === "post" ? post : post?.post;

  const [replyCount, setReplyCount] = useState(originalPost._count.replies || 0);
  const [hasReposted, setHasReposted] = useState(originalPost._count.reposts > 0 ? true : false);
  const [repostCount, setRepostCount] = useState(originalPost._count.reposts || 0);
  const [hasLiked, setHasLiked] = useState(originalPost._count.likes > 0 ? true : false);
  const [likeCount, setLikeCount] = useState(originalPost._count.likes || 0);

  const handleRepostToggle = async () => {
    setHasReposted(!hasReposted);
    setRepostCount((prev) => prev + (hasReposted ? -1 : 1));

    try {
      const endpoint = `/post/${originalPost.id}/repost`;
      const method = hasReposted ? "DELETE" : "POST";
      await apiClient.request(endpoint, { method });
    } catch (err) {
      console.error("Failed to update repost status:", err);
      alert("Could not update repost status. Please try again.");
      setHasReposted(originalPost.hasReposted);
      setRepostCount(originalPost._count?.reposts || 0);
    }
  };

  const handleLikeToggle = async () => {
    setHasLiked(!hasLiked);
    setLikeCount((prev) => prev + (hasLiked ? -1 : 1));

    try {
      const endpoint = `/post/${originalPost.id}/like`;
      const method = hasLiked ? "DELETE" : "POST";
      await apiClient.request(endpoint, { method });
    } catch (err) {
      console.error("Failed to update like status:", err);
      alert("Could not update like status. Please try again.");
      setHasLiked(originalPost.hasLiked);
      setLikeCount(originalPost._count?.likes || 0);
    }
  };

  const handleDeletePost = async () => {
    try {
      await apiClient.request(`/post/${originalPost.id}`, {
        method: "DELETE",
      });
      refreshFeed();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Could not delete post. Please try again.");
    }
  }

  return (
    <div className="post">
      {post.type === "repost" &&
        <div>🔁 {post.user.display_name} relayed</div>
      }

      <Link to={`/user/${originalPost.author.username}`} className="post-author">
        <div className="post-emoji">{originalPost.author.emoji || "👤"}</div>
        <div className="post-display-name">{originalPost.author.display_name || "Unknown"}</div>
        <div className="post-username">{`@${originalPost.author.username}`}</div>
      </Link>

      <div className="post-date">{new Date(originalPost.createdAt).toLocaleString()}</div>

      <div className="post-content">{originalPost.content}</div>

      <div className="post-actions">
        <div
          className="reply-button"
        >
          💬 {replyCount}
        </div>
        <div
          className={`repost-button ${hasReposted ? "reposted" : ""}`}
          onClick={handleRepostToggle}
        >
          🔁 {repostCount}
        </div>
        <div
          className={`like-button ${hasLiked ? "liked" : ""}`}
          onClick={handleLikeToggle}
        >
          ❤️ {likeCount}
        </div>

        {originalPost.author.username === authUser?.username &&
          <div
            className="delete-button"
            onClick={handleDeletePost}
          >
            🗑️
          </div>
        }
      </div>
    </div>
  );
}

export default PostItem;