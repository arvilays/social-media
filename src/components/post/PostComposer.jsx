import { useState } from "react";
import "../../styles/postComposer.css";

export const PostComposer = ({
  authUser,
  onSubmit,
  placeholder = "What's on your mind?",
  buttonText = "Post",
  autoFocus = false,
}) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      alert("Please log in to post.");
      return;
    }

    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } catch {
      alert("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-composer">
      <div className="post-composer-avatar">{authUser?.emoji || "👤"}</div>
      <form className="post-composer-message" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={authUser ? placeholder : "Log in to post something..."}
          maxLength={280}
          autoFocus={autoFocus}
          disabled={!authUser || submitting}
        />
        <button disabled={!authUser || !content.trim() || submitting}>
          {submitting ? "Posting..." : buttonText}
        </button>
      </form>
    </div>
  );
};
