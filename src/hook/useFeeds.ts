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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return; // Nếu user không tồn tại, không thực hiện gì

    // Lấy danh sách người dùng đã like từ localStorage
    const storedLikes = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );

    setArticles((prevArticles) =>
      prevArticles.map((article) => ({
        ...article,
        // Cập nhật lại trạng thái "favorited" và "favoritesCount"
        favorited:
          storedLikes[article.slug]?.includes(user.username) ||
          article.favorited,
        // Đảm bảo favoritesCount luôn là số hợp lệ, tránh NaN
        favoritesCount:
          storedLikes[article.slug]?.length || article.favoritesCount || 0,
        // Lưu lại danh sách người đã like (likedBy)
        likedBy: storedLikes[article.slug] || article.likedBy || [],
      }))
    );
  }, [user]); // Chạy lại mỗi khi user thay đổi

  const fetchArticles = async () => {
    if (activeTab === "your" && !authToken) {
      setArticles([]);
      setTotalArticles(0);
      return;
    }

    // setIsLoading(true);
    const startTime = Date.now(); // Bắt đầu tính thời gian
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
      // const elapsedTime = Date.now() - startTime;
      // const minLoadingTime = 500; // Thời gian tối thiểu để spinner hiển thị
      // setTimeout(
      //   () => setIsLoading(false),
      //   Math.max(0, minLoadingTime - elapsedTime)
      // );
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

    // Đảm bảo favoritesCount là số hợp lệ, nếu không thì gán là 0
    const validFavoritesCount = isNaN(favoritesCount) ? 0 : favoritesCount;

    const storedLikes = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    const currentLikes = storedLikes[slug] || [];

    // Kiểm tra nếu người dùng đã like rồi thì không thay đổi gì
    const updatedFavorited = !currentLikes.includes(user.username); // Nếu user chưa like, thì like, ngược lại thì unlike

    // Tính toán lại số lượng like
    const updatedFavoritesCount = updatedFavorited
      ? validFavoritesCount + 1
      : Math.max(validFavoritesCount - 1, 0);

    // Thêm hoặc xóa người dùng khỏi danh sách likedBy
    const updatedLikedBy = updatedFavorited
      ? [...currentLikes, user.username]
      : currentLikes.filter((username: string) => username !== user.username);

    // Cập nhật lại localStorage
    storedLikes[slug] = updatedLikedBy;
    localStorage.setItem("likedArticles", JSON.stringify(storedLikes));

    // Cập nhật lại UI với trạng thái mới
    setArticles((prev) =>
      prev.map((article) =>
        article.slug === slug
          ? {
              ...article,
              favorited: updatedFavorited,
              favoritesCount: updatedFavoritesCount,
              likedBy: updatedLikedBy,
            }
          : article
      )
    );

    try {
      // Gửi yêu cầu đến API để cập nhật trạng thái thích/unlike
      if (updatedFavorited) {
        await favoriteArticle(slug); // Thực hiện hành động "like"
      } else {
        await unfavoriteArticle(slug); // Thực hiện hành động "unlike"
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", err);

      // Nếu có lỗi, quay lại trạng thái ban đầu
      setArticles((prev) =>
        prev.map((article) =>
          article.slug === slug
            ? {
                ...article,
                favorited: favorited, // Quay lại trạng thái ban đầu
                favoritesCount: favorited
                  ? validFavoritesCount + 1
                  : Math.max(validFavoritesCount - 1, 0),
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
