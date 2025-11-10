import { useState, useEffect, useCallback, useRef } from "react";
import { useFeed } from "../hooks/useFeed";
import { usePost } from "../hooks/usePost";
import { PostComposer } from "./post/PostComposer";
import { FeedTabs } from "./feed/FeedTabs";
import { FeedList } from "./feed/FeedList";
import { LoadingMessage } from "./common/LoadingMessage";
import { ErrorMessage } from "./common/ErrorMessage";
import "../styles/home.css";

export const Home = ({ authUser, apiClient }) => {
  const [feedCategory, setFeedCategory] = useState("global");

  const {
    posts,
    isLoading,
    isFetchingNextPage,
    error,
    fetchFeed,
    fetchNextPage,
    hasNextPage,
  } = useFeed(apiClient);

  const { createPost } = usePost(apiClient);

  // Show "Following" only if user is logged in.
  const tabs = authUser
    ? [
      { value: "global", label: "Global" },
      { value: "following", label: "Following" },
    ]
    : [{ value: "global", label: "Global" }];

  const refreshFeed = useCallback(() => {
    const endpoint =
      feedCategory === "global" ? "/feed/global" : "/feed/following";
    fetchFeed(endpoint);
  }, [feedCategory, fetchFeed]);

  useEffect(() => {
    if (feedCategory === "following" && !authUser) return;
    refreshFeed();
  }, [feedCategory, authUser, refreshFeed]);

  const handleCreatePost = async (content) => {
    await createPost(content);
    refreshFeed();
  };

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "500px" }
    );

    const currentLoader = loaderRef.current;
    observer.observe(currentLoader);

    return () => observer.unobserve(currentLoader);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    document.title = "home · stellr";
  }, []);

  const renderFeedContent = () => {
    if (feedCategory === "following" && !authUser) return null;

    if (isLoading && posts.length === 0) {
      return <LoadingMessage message="Loading feed..." />;
    }

    if (error && posts.length === 0) {
      return (
        <ErrorMessage
          message={`Failed to load feed: ${error}`}
          onRetry={refreshFeed}
        />
      );
    }

    if (!posts.length) {
      return <div className="home-empty">No posts to show.</div>;
    }

    return (
      <>
        <FeedList
          posts={posts}
          refreshFeed={refreshFeed}
          authUser={authUser}
          apiClient={apiClient}
        />
        {isFetchingNextPage && <LoadingMessage message="Loading more..." />}
        {!hasNextPage && <div className="feed-end-message">You've reached the end!</div>}
        <div ref={loaderRef} style={{ height: "1px" }} />
      </>
    );
  };

  return (
    <div className="home-container">
      <FeedTabs
        activeTab={feedCategory}
        tabs={tabs}
        onTabChange={(tab) => {
          if (tab === "following" && !authUser) return;
          setFeedCategory(tab);
        }}
      />

      {authUser && (
        <PostComposer
          authUser={authUser}
          onSubmit={handleCreatePost}
          placeholder="What's on your mind?"
        />
      )}

      <div className="home-feed">{renderFeedContent()}</div>
    </div>
  );
};

export default Home;
