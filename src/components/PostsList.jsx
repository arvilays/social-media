import { Link } from "react-router-dom";
import "../styles/postsList.css";

function PostItem({ post }) {
  return (
    <div className="post">
      <Link to={`/user/${post.author?.username}`} className="post-author">
        {post.author?.emoji || "👤"}
        {post.author?.username || "Unknown"}
      </Link>
      <div className="post-date">{post.createdAt}</div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <div>Comments</div>
        <div>Repost</div>
        <div>Like</div>
      </div>
    </div>
  );
}

function PostsList({ posts = [] }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="posts">No posts yet.</div>;
  }

  return (
    <div className="posts">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostsList;

