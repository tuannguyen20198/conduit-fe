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
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isLoading = isProfileLoading || isArticlesLoading;
  const error = profileError || articlesError;

  // Set default tab to "myArticles" when the component loads for the first time
  useEffect(() => {
    if (!activeTab) {
      setActiveTab("myArticles"); // Set "myArticles" as the default active tab
    }
  }, []); // Empty dependency to run only once

  // Ensure active tab is "myArticles" when visiting a specific user's profile
  useEffect(() => {
    if (username) {
      setActiveTab("myArticles"); // Set "myArticles" as the active tab when visiting any user's profile page
    }
  }, [username]);

  // Handle tab click to switch between 'myArticles' and 'favoritedArticles'
  const handleTabClick = (tab: "myArticles" | "favoritedArticles") => {
    setActiveTab(tab); // Update active tab
    setCurrentPage(1); // Reset to page 1 when switching tabs
  };

  // Handle page click for pagination
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // Update current page for pagination
  };

  // Filter articles by favorites count (only for 'favoritedArticles')
  const filteredArticles =
    articlesData?.articles?.filter((article: any) => {
      if (activeTab === "favoritedArticles") {
        return article.favoritesCount >= 1; // Only show articles with at least 1 like
      }
      return true; // For 'myArticles', show all articles
    }) || [];

  // Paginate filtered articles for the current page
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Calculate the total number of pages
  const pageCount = Math.max(
    1,
    Math.ceil(filteredArticles.length / articlesPerPage)
  );

  return {
    profileData,
    articlesData: paginatedArticles, // Return only the paginated articles
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
