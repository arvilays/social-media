import { useState } from "react";
import { formatNumber } from "../../utils/postHelpers";

export const PostActions = ({
  post,
  authUser,
  onReply,
  onToggleLike,
  onToggleRepost,
  onToggleBookmark,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isOwnPost = post.author?.username === authUser?.username;

  const userHasLiked = post.likes?.some((like) => like.userId === authUser?.id) || false;
  const userHasReposted = post.reposts?.some((repost) => repost.userId === authUser?.id) || false;
  const userHasBookmarked = post.bookmarks?.some((bookmark) => bookmark.userId === authUser?.id) || false;

  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [isReposted, setIsReposted] = useState(userHasReposted);
  const [isBookmarked, setIsBookmarked] = useState(userHasBookmarked);

  const [counts, setCounts] = useState({
    replies: post._count?.replies || 0,
    reposts: post._count?.reposts || 0,
    likes: post._count?.likes || 0,
  });

  const requireAuth = () => {
    if (!authUser) {
      alert("Please log in to interact with posts.");
      return false;
    }
    return true;
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;
    onReply?.();
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    setIsLiked(!isLiked);
    setCounts((prev) => ({ ...prev, likes: prev.likes + (isLiked ? -1 : 1) }));
    await onToggleLike(post.id, isLiked);
  };

  const handleRepostClick = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    setIsReposted(!isReposted);
    setCounts((prev) => ({ ...prev, reposts: prev.reposts + (isReposted ? -1 : 1) }));
    await onToggleRepost(post.id, isReposted);
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    setIsBookmarked(!isBookmarked);
    await onToggleBookmark(post.id, isBookmarked);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(!confirmDelete);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;
    onDelete(post.id);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div className="post-actions">
      <button disabled={!authUser} onClick={handleReplyClick} title="Reply">
        💬 {formatNumber(counts.replies)}
      </button>

      <button disabled={!authUser} onClick={handleRepostClick} title="Relay">
        {isReposted ? "↩️" : "🔁"} {formatNumber(counts.reposts)}
      </button>

      <button disabled={!authUser} onClick={handleLikeClick} title="Like">
        {isLiked ? "❤️" : "🤍"} {formatNumber(counts.likes)}
      </button>

      <button disabled={!authUser} onClick={handleBookmarkClick} title="Bookmark">
        {isBookmarked ? "🔖" : "📑"}
      </button>

      {isOwnPost && (
        <div className="post-delete">
          <button onClick={handleDeleteClick} title="Delete">
            🗑️
          </button>
          {confirmDelete && (
            <div className="post-delete-confirm">
              <button onClick={handleCancelDelete}>❌</button>
              <button onClick={handleConfirmDelete}>✅</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
