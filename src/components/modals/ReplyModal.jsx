import { getOriginalPost } from "../../utils/postHelpers";
import { PostComposer } from "../post/PostComposer";
import "../../styles/modal.css";

export const ReplyModal = ({ post, authUser, onClose, onSubmit }) => {
  const originalPost = getOriginalPost(post);

  if (!originalPost) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            Replying to @{originalPost.author.username}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-original-post">
            <div className="modal-post-author">
              <span className="modal-post-emoji">
                {originalPost.author.emoji || "👤"}
              </span>
              <span className="modal-post-display-name">
                {originalPost.author.display_name || "Unknown"}
              </span>
              <span className="modal-post-username">
                @{originalPost.author.username}
              </span>
            </div>
            <div className="modal-post-content">{originalPost.content}</div>
          </div>

          <PostComposer
            authUser={authUser}
            onSubmit={onSubmit}
            placeholder="What's your reply?"
            buttonText="Reply"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
