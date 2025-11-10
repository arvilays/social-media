import { useState, useCallback } from "react";

export const useFeed = (apiClient) => {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState(null);
  const [currentEndpoint, setCurrentEndpoint] = useState("");

  // Fetch the first page and reset the feed
  const fetchFeed = useCallback(async (endpoint) => {
    setIsLoading(true);
    setError(null);
    setCurrentEndpoint(endpoint);

    try {
      const response = await apiClient.request(endpoint);
      setPosts(response.feed || []);
      setCursor(response.nextCursor || null);
      setHasNextPage(!!response.nextCursor);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  // Fetch the next page and append
  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !currentEndpoint) return;

    setIsFetchingNextPage(true);
    setError(null);

    try {
      const url = `${currentEndpoint}?cursor=${cursor}`;
      const response = await apiClient.request(url);

      setPosts((prevPosts) => [...prevPosts, ...(response.feed || [])]);
      setCursor(response.nextCursor || null);
      setHasNextPage(!!response.nextCursor);
    } catch (err) {
      console.error("Error fetching next page:", err);
      setError(err.message || "Could not load more posts.");
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [apiClient, cursor, hasNextPage, isFetchingNextPage, currentEndpoint]);

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    error,
    fetchFeed,
    fetchNextPage,
    hasNextPage,
  };
};
