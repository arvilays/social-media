import { useState, useEffect, useCallback } from "react";
import { PostItem } from "./post/PostItem";
import { FeedList } from "./feed/FeedList";
import { PostComposer } from "./post/PostComposer";
import { usePost } from "../hooks/usePost";
import { LoadingMessage } from "./common/LoadingMessage";
import { ErrorMessage } from "./common/ErrorMessage";
import "../styles/post.css";

export const Post = ({ postId, authUser, apiClient }) => {
  const [mainPostData, setMainPostData] = useState(null);
  const [parentPostData, setParentPostData] = useState([]);
  const [replyPostData, setReplyPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { createPost } = usePost(apiClient);

  const fetchConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [mainPost, parents, replies] = await Promise.all([
        apiClient.request(`/post/${postId}`),
        apiClient.request(`/post/${postId}/parents`),
        apiClient.request(`/post/${postId}/replies`),
      ]);

      setMainPostData(mainPost);
      setParentPostData(parents || []);
      setReplyPostData(replies || []);
    } catch (err) {
      console.error("Failed to fetch post:", err);
      setError("Post not found.");
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, postId]);

  const handleCreateReply = async (content) => {
    try {
      await createPost(content, mainPostData?.id);
      await fetchConversation(); 
    } catch (err) {
      console.error("Failed to submit reply:", err);
      alert("Could not submit reply. Please try again.");
    }
  };

  useEffect(() => {
    if (postId) fetchConversation();
  }, [fetchConversation, postId]);

  useEffect(() => {
    if (!mainPostData) return;

    const maxLength = 60; 
    let contentPreview = mainPostData.content || "";

    if (contentPreview.length > maxLength) {
      contentPreview = contentPreview.slice(0, maxLength) + "…";
    }

    document.title = `${mainPostData.author.display_name} on stellr: "${contentPreview}"`;
  }, [mainPostData]);

  if (isLoading) {
    return (
      <div className="post-view">
        <LoadingMessage message="Loading post..." />
      </div>
    );
  }

  if (error || !mainPostData) {
    return <ErrorMessage message={error || "Post not found."} />;
  }

  return (
    <div className="post-view">
      {parentPostData.length > 0 &&
        parentPostData.map((parent) => (
          <PostItem
            key={parent.id}
            post={parent}
            authUser={authUser}
            apiClient={apiClient}
          />
        ))}

      <div key={mainPostData.id} className="post-main">
        <PostItem
          post={mainPostData}
          authUser={authUser}
          apiClient={apiClient}
          onRefresh={fetchConversation}
        />
      </div>

      {authUser && (
        <PostComposer
          authUser={authUser}
          onSubmit={handleCreateReply}
          placeholder={`Reply to ${mainPostData.author?.display_name || "this post"}...`}
        />
      )}

      <div className="post-replies-header">Replies</div>
      <FeedList
        posts={replyPostData}
        authUser={authUser}
        apiClient={apiClient}
        refreshFeed={fetchConversation}
      />
    </div>
  );
};

export default Post;
