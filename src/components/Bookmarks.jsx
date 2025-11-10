import { useEffect, useRef } from "react";
import { useFeed } from "../hooks/useFeed";
import { FeedList } from "./feed/FeedList";
import { LoadingMessage } from "./common/LoadingMessage";
import { ErrorMessage } from "./common/ErrorMessage";
import "../styles/Bookmarks.css";

export const Bookmarks = ({ authUser, apiClient }) => {
  const {
    posts,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    fetchFeed,
  } = useFeed(apiClient);

  const loaderRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      fetchFeed("/feed/bookmarks");
    }
  }, [authUser, fetchFeed]);

  useEffect(() => {
    document.title = "bookmarks · stellr";
  }, []);

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

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Failed to load bookmarks. Please try again.";

  if (isLoading && posts.length === 0) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">Your Bookmarks</div>
        <LoadingMessage message="Loading your bookmarks..." />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">Your Bookmarks</div>
        <ErrorMessage
          message={errorMessage}
          onRetry={() => fetchFeed("/feed/bookmarks")}
        />
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">Your Bookmarks</div>
        <div className="bookmarks-empty">No bookmarks yet.</div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">Your Bookmarks</div>

      <FeedList
        posts={posts}
        refreshFeed={() => fetchFeed("/feed/bookmarks")}
        authUser={authUser}
        apiClient={apiClient}
      />

      {isFetchingNextPage && <LoadingMessage message="Loading more..." />}
      {!hasNextPage && posts.length > 0 && (
        <div className="feed-end-message">You've reached the end!</div>
      )}

      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
