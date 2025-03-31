import { useAuth } from "@/context/AuthContext";
import { ArticleFormData } from "@/interfaces/article";
import React, { useEffect, useState } from "react";
import { useTags } from "./useTags";
import {
  favoriteArticle,
  followUser,
  getArticles,
  unfavoriteArticle,
  unfollowUser,
} from "@/lib/api";

const useFeeds = () => {
  const [activeTab, setActiveTab] = useState<"your" | "global">("global");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticleFormData[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const articlesPerPage = 10;
  const { user: authToken } = useAuth();
  const { data: tags } = useTags();
  const pageCount = Math.max(1, Math.ceil(totalArticles / articlesPerPage));
  useEffect(() => {
    const storedLikes = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    setArticles((prevArticles) =>
      prevArticles.map((article) => ({
        ...article,
        favorited: storedLikes[article.slug] ?? article.favorited,
      }))
    );
  }, []);

  const fetchArticles = async () => {
    if (activeTab === "your" && !authToken) {
      setArticles([]);
      setTotalArticles(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getArticles({
        feed: activeTab === "your" ? true : undefined,
        tag: selectedTags.length ? selectedTags.join(",") : undefined,
        offset: (currentPage - 1) * articlesPerPage,
        limit: articlesPerPage,
      });

      const storedLikes = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );
      const filteredArticles =
        activeTab === "your"
          ? response.articles.filter(
              (article: { author: { following: any } }) =>
                article.author.following
            )
          : response.articles;

      setArticles(
        filteredArticles.map(
          (article: { slug: string | number; favorited: any }) => ({
            ...article,
            favorited: storedLikes[article.slug] ?? article.favorited,
          })
        )
      );
      setTotalArticles(response.articlesCount); // Cập nhật đúng tổng số bài viết
    } catch (err) {
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi đổi tag
  }, [selectedTags]);

  useEffect(() => {
    fetchArticles();
  }, [activeTab, selectedTags, currentPage, authToken]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleLike = async (slug: string, favorited: boolean) => {
    if (!user) {
      alert("Bạn cần đăng nhập để like bài viết!");
      return;
    }

    const updatedFavorited = !favorited;
    const prevArticles = [...articles]; // Lưu lại trạng thái trước đó

    // Cập nhật UI tạm thời
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.slug === slug
          ? {
              ...article,
              favorited: updatedFavorited,
              favoritesCount: updatedFavorited
                ? article.favoritesCount + 1
                : article.favoritesCount - 1,
            }
          : article
      )
    );

    try {
      if (updatedFavorited) {
        await favoriteArticle(slug);
      } else {
        await unfavoriteArticle(slug);
      }

      // Cập nhật localStorage
      const storedLikes = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );
      storedLikes[slug] = updatedFavorited;
      localStorage.setItem("likedArticles", JSON.stringify(storedLikes));
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", err);

      // Nếu lỗi, hoàn tác cập nhật UI
      setArticles(prevArticles);
    }
  };

  const handleFollow = async (username: string, following: boolean) => {
    try {
      const updatedUser = following
        ? await unfollowUser(username)
        : await followUser(username);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.author.username === username
            ? {
                ...article,
                author: { ...article.author, following: updatedUser.following },
              }
            : article
        )
      );
    } catch (err) {
      console.error("Error updating follow status", err);
    }
  };
  return {
    activeTab,
    authToken,
    tags,
    setActiveTab,
    selectedTags,
    setSelectedTags,
    currentPage,
    setCurrentPage,
    articles,
    setArticles,
    totalArticles,
    setTotalArticles,
    isLoading,
    setIsLoading,
    error,
    setError,
    pageCount,
    handlePageClick,
    handleLike,
    handleFollow,
  };
};

export default useFeeds;
