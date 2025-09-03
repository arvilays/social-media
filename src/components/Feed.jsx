import { useState } from "react";
import "../styles/feed.css";

function Feed() {
  const [createPostContent, setCreatePostContent] = useState("");

  const handleCreatePost = async () => {

  }

  return (
    <div className="home-center">
      <div className="">Category</div>
      <div className="home-center-compose">
        <textarea
          value={createPostContent}
          onChange={(e) => setCreatePostContent(e.target.value)}
          placeholder="What's on your mind?"
          minLength="1"
          maxLength="280"
        />
        <button onClick={handleCreatePost}>Submit</button>
      </div>
      <div className="">Feed</div>
    </div>
  );
}

export default Feed;