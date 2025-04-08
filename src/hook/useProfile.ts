// useProfile.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticlesGeneral, getProfile } from "@/lib/api"; // API calls

const useProfile = (username: string) => {
  const [activeTab, setActiveTab] = useState<
    "myArticles" | "favoritedArticles"
  >("myArticles");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // Fetching profile data
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });

  // Fetching articles data
  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    error: articlesError,
  } = useQuery({
    queryKey: ["articles", username],
    queryFn: () => getArticlesGeneral({ author: username, limit: 10 }),
    enabled: !!profileData, // Only fetch articles when profile data is available
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isProfileLoading || isArticlesLoading;
  const error = profileError || articlesError;

  // Set default tab to "myArticles" when the component loads for the first time
  useEffect(() => {
    if (!activeTab) {
      setActiveTab("myArticles"); // Set "myArticles" as the default active tab
    }
  }, [activeTab]);

  // Ensure active tab is "myArticles" when visiting a specific user's profile
  useEffect(() => {
    if (username) {
      setActiveTab("myArticles"); // Set "myArticles" as the active tab when visiting any user's profile page
    }
  }, [username]);

  const handleTabClick = (tab: "myArticles" | "favoritedArticles") => {
    setActiveTab(tab); // Update active tab
    setCurrentPage(1); // Reset to page 1 when switching tabs
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // Update current page for pagination
  };

  // Filter articles by favorites count (only for 'favoritedArticles')
  const filteredArticles =
    articlesData?.filter((article: any) => {
      if (activeTab === "favoritedArticles") {
        return article.favoritesCount >= 1; // Only show articles with at least 1 like
      }
      return true; // For 'myArticles', show all
    }) || [];

  const pageCount = Math.ceil(filteredArticles.length / articlesPerPage);

  return {
    profileData,
    articlesData: filteredArticles,
    isLoading,
    error,
    activeTab,
    currentPage,
    pageCount,
    handleTabClick,
    handlePageClick,
  };
};

export default useProfile;
