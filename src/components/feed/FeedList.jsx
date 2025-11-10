import { useState } from "react";
import { PostItem } from "../post/PostItem";
import { ReplyModal } from "../modals/ReplyModal";
import { usePost } from "../../hooks/usePost";
import { getPostId } from "../../utils/postHelpers";
import "../../styles/feedList.css";

export const FeedList = ({ posts, refreshFeed, authUser, apiClient }) => {
  const [replyingToPost, setReplyingToPost] = useState(null);
  const { createPost } = usePost(apiClient);

  const handleOpenReply = (post) => setReplyingToPost(post);
  const handleCloseReply = () => setReplyingToPost(null);

  const handleSubmitReply = async (content) => {
    const parentId = getPostId(replyingToPost);
    await createPost(content, parentId);
    handleCloseReply();
    refreshFeed?.();
  };

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="feed-empty">No posts yet.</div>;
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          authUser={authUser}
          apiClient={apiClient}
          onReply={handleOpenReply}
          onRefresh={refreshFeed}
        />
      ))}

      {replyingToPost && (
        <ReplyModal
          post={replyingToPost}
          authUser={authUser}
          onClose={handleCloseReply}
          onSubmit={handleSubmitReply}
        />
      )}
    </div>
  );
};

export default FeedList;
