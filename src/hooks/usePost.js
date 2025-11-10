import { useState, useCallback } from "react";

export const usePost = (apiClient) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a new post or a reply
  const createPost = useCallback(
    async (content, parentId = null) => {
      if (!content?.trim()) {
        throw new Error("Post content cannot be empty");
      }

      setIsSubmitting(true);
      try {
        const data = { content };
        if (parentId) data.parentId = parentId;

        await apiClient.request("/post", { method: "POST", data });
      } finally {
        setIsSubmitting(false);
      }
    },
    [apiClient]
  );

  // Delete a post by ID
  const deletePost = useCallback(
    async (postId) => {
      if (!postId) return;
      await apiClient.request(`/post/${postId}`, { method: "DELETE" });
    },
    [apiClient]
  );

  // Toggle like state for a post
  const toggleLike = useCallback(
    async (postId, isLiked) => {
      if (!postId) return;
      const method = isLiked ? "DELETE" : "POST";
      await apiClient.request(`/post/${postId}/like`, { method });
    },
    [apiClient]
  );

  // Toggle repost state for a post
  const toggleRepost = useCallback(
    async (postId, isReposted) => {
      if (!postId) return;
      const method = isReposted ? "DELETE" : "POST";
      await apiClient.request(`/post/${postId}/repost`, { method });
    },
    [apiClient]
  );

  return { createPost, deletePost, toggleLike, toggleRepost, isSubmitting };
};
