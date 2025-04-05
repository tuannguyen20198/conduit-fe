import { useAuth } from "@/context/AuthContext";
import { ArticleFormData } from "@/interfaces/article";
import React, { useEffect, useState } from "react";
import { useTags } from "./useTags";
import {
  favoriteArticle,
  followUser,
  getArticlesFeed,
  getArticlesGeneral,
  unfavoriteArticle,
  unfollowUser,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axiosConfig";

const useFeeds = () => {
  const [activeTab, setActiveTab] = useState<
    | "your"
    | "global"
    | "tag"
    | "favorited"
    | "myArticles"
    | "favoritedArticles"
    | "feed"
  >("global");
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
  const navigate = useNavigate();
  const simulateDelay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  // Chạy khi hash trong URL thay đổi
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && !selectedTags.includes(hash)) {
      setSelectedTags([hash]); // Chọn tag khi có hash
      setActiveTab("tag"); // Chuyển sang tab tag
    }
  }, [selectedTags]);

  // Fetch articles for the current tab, tags, and user preferences
  const fetchArticles = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    await simulateDelay(500);
    try {
      let url = "/articles";
      let params: any = {
        offset: (currentPage - 1) * articlesPerPage,
        limit: articlesPerPage,
      };

      // Logic để thay đổi endpoint và params khi ở tab "your"
      if (activeTab === "your" && authToken) {
        url = "/articles/feed"; // Đổi thành endpoint cho "Your Feed"
        // params = { ...params, author: "username_from_auth_token" }; // Bạn cần thay thế author bằng thông tin user thực tế
      } else if (activeTab === "global") {
        url = "/articles"; // Global feed
      } else if (activeTab === "tag" && selectedTags.length > 0) {
        params = { ...params, tag: selectedTags[0] }; // Thêm tag nếu có
      }

      // Gọi API
      const response = await api.get(url, { params });

      // Cập nhật dữ liệu bài viết
      setArticles(response.data.articles);
      // setPageCount(Math.ceil(response.data.articlesCount / articlesPerPage)); // Cập nhật số trang
    } catch (err) {
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };
  // Chạy khi các giá trị thay đổi (tab, tags, page)
  useEffect(() => {
    // Khi tab thay đổi, gọi lại API
    fetchArticles();
  }, [activeTab, selectedTags, currentPage]); // Chạy lại khi có thay đổi

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleLike = async (
    slug: string,
    favorited: boolean,
    favoritesCount: number
  ) => {
    if (!user) {
      alert("Bạn cần đăng nhập để like bài viết!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    const validFavoritesCount = isNaN(favoritesCount) ? 0 : favoritesCount;
    const storedLikes = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    const currentLikes = storedLikes[slug] || [];

    // Kiểm tra xem người dùng đã like bài viết chưa
    const updatedFavorited = !currentLikes.includes(user.username);

    // Cập nhật số lượt like
    const updatedFavoritesCount = updatedFavorited
      ? validFavoritesCount + 1 // Tăng số lượt like khi người dùng like
      : validFavoritesCount - 1; // Giảm số lượt like khi người dùng un-like

    // Cập nhật danh sách "likedBy"
    const updatedLikedBy = updatedFavorited
      ? [...currentLikes, user.username] // Thêm người dùng vào danh sách "likedBy"
      : currentLikes.filter((username: string) => username !== user.username); // Xóa người dùng khỏi danh sách "likedBy"

    // Lưu danh sách "likedArticles" vào localStorage
    storedLikes[slug] = updatedLikedBy;
    localStorage.setItem("likedArticles", JSON.stringify(storedLikes));

    // Cập nhật lại bài viết trong state
    setArticles((prev) =>
      prev.map((article) =>
        article.slug === slug
          ? {
              ...article,
              favorited: updatedFavorited,
              favoritesCount: updatedFavoritesCount, // Cập nhật đúng số lượt like
              likedBy: updatedLikedBy, // Cập nhật danh sách người đã like
            }
          : article
      )
    );

    try {
      if (updatedFavorited) {
        // Gọi API để thêm bài viết vào danh sách yêu thích
        await favoriteArticle(slug);
      } else {
        // Gọi API để hủy bài viết khỏi danh sách yêu thích
        await unfavoriteArticle(slug);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", err);
      // Nếu có lỗi, phục hồi lại trạng thái ban đầu
      setArticles((prev) =>
        prev.map((article) =>
          article.slug === slug
            ? {
                ...article,
                favorited: favorited,
                favoritesCount: favorited
                  ? validFavoritesCount + 1
                  : validFavoritesCount - 1,
              }
            : article
        )
      );
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

  const handleTagClick = (tag: string) => {
    setSelectedTags([tag]);
    setActiveTab("tag"); // Chuyển sang tab tag
    window.location.hash = tag; // Cập nhật URL hash
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
    handleTagClick,
  };
};

export default useFeeds;
