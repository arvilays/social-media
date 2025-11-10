import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FeedList } from "./feed/FeedList";
import { FeedTabs } from "./feed/FeedTabs";
import { useFeed } from "../hooks/useFeed";
import { LoadingMessage } from "./common/LoadingMessage";
import { ErrorMessage } from "./common/ErrorMessage";
import { FollowListModal } from "./modals/FollowListModal";
import { formatNumber } from "../utils/postHelpers";
import "../styles/profile.css";

export const Profile = ({ username, authUser, apiClient }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [feedCategory, setFeedCategory] = useState("posts");
  const {
    posts,
    isLoading: isFeedLoading,
    isFetchingNextPage,
    error: feedError,
    fetchFeed,
    fetchNextPage,
    hasNextPage,
  } = useFeed(apiClient);

  const [showFollowList, setShowFollowList] = useState(false);
  const [followListType, setFollowListType] = useState(null);
  const [followList, setFollowList] = useState([]);
  const [isFollowListLoading, setIsFollowListLoading] = useState(false);
  const [followCursor, setFollowCursor] = useState(null);
  const [hasMoreFollow, setHasMoreFollow] = useState(true);
  const followLoaderRef = useRef(null);

  const tabs = [
    { value: "posts", label: "Posts" },
    { value: "likes", label: "Likes" },
  ];

  const fetchUser = useCallback(async () => {
    setIsPageLoading(true);
    setPageError(null);
    setUser(null);
    setIsFollowing(false);

    try {
      const response = await apiClient.request(`/user/${username}`);
      setUser(response);
      setIsFollowing(response.isFollowing || false);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setPageError("Could not fetch user info.");
    } finally {
      setIsPageLoading(false);
    }
  }, [apiClient, username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      document.title = `${user.display_name} (@${user.username}) · stellr`;
    } else {
      document.title = "stellr"; 
    }
  }, [user]);

  const handleFollowToggle = async () => {
    if (!authUser || isFollowLoading) return;

    const wasFollowing = isFollowing;
    setIsFollowLoading(true);
    setIsFollowing(!wasFollowing);

    setUser((prev) => ({
      ...prev,
      _count: {
        ...prev._count,
        followers: (prev._count?.followers || 0) + (wasFollowing ? -1 : 1),
      },
    }));

    try {
      const method = wasFollowing ? "DELETE" : "POST";
      await apiClient.request(`/user/${username}/follow`, { method });
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      setIsFollowing(wasFollowing);
      setUser((prev) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: (prev._count?.followers || 0) + (wasFollowing ? 1 : -1),
        },
      }));
      alert("Failed to update follow status. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleOpenFollowList = (type) => {
    setFollowListType(type);
    setShowFollowList(true);
    setFollowList([]);
    setFollowCursor(null);
    setHasMoreFollow(true);
  };

  const fetchFollowListPage = useCallback(async () => {
    if (!username || !followListType || !hasMoreFollow || isFollowListLoading) return;

    setIsFollowListLoading(true);
    try {
      const url = `/user/${username}/${followListType}${followCursor ? `?cursor=${followCursor}` : ""}`;
      const result = await apiClient.request(url);

      setFollowList((prev) => [...prev, ...result.users]);
      setFollowCursor(result.nextCursor);
      setHasMoreFollow(!!result.nextCursor);
    } catch (err) {
      console.error(`Failed to fetch ${followListType}:`, err);
    } finally {
      setIsFollowListLoading(false);
    }
  }, [username, followListType, followCursor, hasMoreFollow, isFollowListLoading, apiClient]);

  useEffect(() => {
    if (!followLoaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreFollow && !isFollowListLoading) {
          fetchFollowListPage();
        }
      },
      { root: followLoaderRef.current.parentElement, threshold: 1 }
    );

    const currentLoader = followLoaderRef.current;
    observer.observe(currentLoader);
    return () => observer.unobserve(currentLoader);
  }, [fetchFollowListPage, hasMoreFollow, isFollowListLoading]);

  const refreshFeed = useCallback(() => {
    if (!username) return;
    const endpoint = feedCategory === "posts" ? `/feed/${username}/posts` : `/feed/${username}/likes`;
    fetchFeed(endpoint);
  }, [feedCategory, username, fetchFeed]);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

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

  const renderFollowButton = () => {
    if (!authUser || !user || authUser.username === user.username) return null;
    return (
      <button
        className={`follow-button ${isFollowing ? "following" : ""}`}
        onClick={handleFollowToggle}
        disabled={isFollowLoading}
      >
        {isFollowLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    );
  };

  const renderFeed = () => {
    if (isFeedLoading && posts.length === 0) return <LoadingMessage message="Loading posts..." />;
    if (feedError && posts.length === 0) return <ErrorMessage message={feedError} onRetry={refreshFeed} />;
    return (
      <>
        <FeedList posts={posts} refreshFeed={refreshFeed} authUser={authUser} apiClient={apiClient} />
        {isFetchingNextPage && <LoadingMessage message="Loading more..." />}
        {!hasNextPage && posts.length > 0 && <div className="feed-end-message">You've reached the end!</div>}
        <div ref={loaderRef} style={{ height: "1px" }} />
      </>
    );
  };

  if (isPageLoading) return <LoadingMessage />;
  if (pageError) return <ErrorMessage message={pageError} />;
  if (!user) return <ErrorMessage message="No user found." />;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-emoji">{user.emoji}</div>
          <div className="profile-display-name">{user.display_name}</div>
          <div className="profile-username">@{user.username}</div>
          <div className="profile-bio">{user.bio}</div>
        </div>
        {renderFollowButton()}
      </div>

      <div className="profile-follow-stats">
        <div className="profile-following" onClick={() => handleOpenFollowList("following")}>
          <span className="bold">{formatNumber(user._count?.following || 0)}</span> Following
        </div>
        <div className="profile-followers" onClick={() => handleOpenFollowList("followers")}>
          <span className="bold">{formatNumber(user._count?.followers || 0)}</span> Followers
        </div>
      </div>

      <FeedTabs activeTab={feedCategory} tabs={tabs} onTabChange={setFeedCategory} />
      <div className="profile-feed">{renderFeed()}</div>

      <FollowListModal
        type={followListType}
        isOpen={showFollowList}
        onClose={() => setShowFollowList(false)}
        users={followList}
        isLoading={isFollowListLoading}
        onUserClick={(clickedUsername) => {
          setShowFollowList(false);
          navigate(`/user/${clickedUsername}`);
        }}
        loaderRef={followLoaderRef}
      />
    </div>
  );
};

export default Profile;
