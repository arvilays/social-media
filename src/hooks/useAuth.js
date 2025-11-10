import { useState, useCallback } from "react";

export const useAuth = (apiClient) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current authenticated user
  const fetchAuthUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.request("/user/me");
      setAuthUser(response);
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch user");
      setAuthUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  // Clear authentication state
  const clearAuth = useCallback(() => {
    setAuthUser(null);
    setError(null);
  }, []);

  return { authUser, isLoading, error, fetchAuthUser, clearAuth };
};
