import PostItem from "./PostItem";
import "../styles/feedList.css";

function FeedList({ posts, refreshFeed, authUser, apiClient }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="feed">No posts yet.</div>;
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} refreshFeed={refreshFeed} authUser={authUser} apiClient={apiClient} />
      ))}
    </div>
  );
}

export default FeedList;

