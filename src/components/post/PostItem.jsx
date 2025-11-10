import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, getOriginalPost } from "../../utils/postHelpers";
import { PostActions } from "./PostActions";
import "../../styles/postItem.css";

export const PostItem = ({ post, authUser, onReply, onRefresh, apiClient }) => {
  const originalPost = getOriginalPost(post);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!originalPost) return null;

  const makeRequest = async (url, method) => {
    if (!authUser) {
      alert("Please log in to interact with posts.");
      return;
    }

    try {
      return await apiClient.request(url, { method });
    } catch (err) {
      console.error("Request error:", err);
      alert(`Action failed: ${err.message || "Please try again."}`);
      throw err;
    }
  };

  const handleToggleLike = (postId, isLiked) =>
    makeRequest(`/post/${postId}/like`, isLiked ? "DELETE" : "POST");

  const handleToggleRepost = (postId, isReposted) =>
    makeRequest(`/post/${postId}/repost`, isReposted ? "DELETE" : "POST");

  const handleToggleBookmark = (postId, isBookmarked) =>
    makeRequest(`/post/${postId}/bookmark`, isBookmarked ? "DELETE" : "POST");

  const handleReply = () => {
    if (!authUser) {
      alert("Please log in to interact with posts.");
      return;
    }
    onReply?.(post);
  };

  const handleDelete = async (postId) => {
    if (!authUser) return;
    setIsDeleting(true);
    await makeRequest(`/post/${postId}`, "DELETE");
    setIsDeleting(false);
    onRefresh?.();
  };

  const renderRepostIndicator = () => {
    if (post.type !== "repost") return null;

    const reposters = post.reposters || [];
    const count = reposters.length;

    if (count === 0) return null;
    if (count === 1) return <div className="post-repost-message">🔁 {reposters[0].display_name} relayed</div>;
    if (count === 2)
      return (
        <div className="post-repost-message">
          🔁 {reposters[0].display_name} and {reposters[1].display_name} relayed
        </div>
      );

    return (
      <div className="post-repost-message">
        🔁 {reposters[0].display_name}, {reposters[1].display_name} and {count - 2}{" "}
        {count - 2 === 1 ? "other" : "others"} relayed
      </div>
    );
  };

  return (
    <div className="post">
      {isDeleting && <div className="post-deleting">Deleting...</div>}

      {renderRepostIndicator()}

      <div className="post-author">
        <Link
          to={`/user/${originalPost.author.username}`}
          className="post-author-info"
          style={{ display: "inline-flex", cursor: "pointer", textDecoration: "none" }}
        >
          <div className="post-emoji">{originalPost.author.emoji || "👤"}</div>
          <div className="post-display-name">{originalPost.author.display_name || "Unknown"}</div>
        </Link>
        <div className="post-username">@{originalPost.author.username}</div>
        <div className="post-date">· {formatDate(originalPost.createdAt)}</div>
      </div>

      <Link to={`/post/${originalPost.id}`} className="post-content-link" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post-content">{originalPost.content}</div>
      </Link>

      <PostActions
        post={originalPost}
        authUser={authUser}
        onReply={handleReply}
        onToggleLike={handleToggleLike}
        onToggleRepost={handleToggleRepost}
        onToggleBookmark={handleToggleBookmark}
        onDelete={handleDelete}
      />
    </div>
  );
};
