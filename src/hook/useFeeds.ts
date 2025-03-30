import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArticles, likeArticle, unlikeArticle } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { use } from "react";

export const useFeed = (
  activeTab: "your" | "global",
  selectedTags: string[] = [],
  page: number = 1,
  limit: number = 5
) => {
  const offset = (page - 1) * limit;
  const queryClient = useQueryClient();
  const { user: authToken } = useAuth(); // Lấy token user

  const shouldFetchFeed = activeTab === "your" && !!authToken;

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", activeTab, selectedTags, page],
    queryFn: () =>
      getArticles({
        ...(shouldFetchFeed ? { feed: true } : {}), // Chỉ fetch feed nếu user đăng nhập
        ...(selectedTags.length > 0 ? { tag: selectedTags.join(",") } : {}),
        limit,
        offset,
      }),
    enabled: activeTab === "global" || shouldFetchFeed, // Chỉ fetch nếu là Global hoặc có user đăng nhập
    initialData: { articles: [], articlesCount: 0 },
  });

  // Cập nhật trạng thái like ngay lập tức
  const updateArticleOptimistically = (slug: string, favorited: boolean) => {
    queryClient.setQueryData(
      ["articles", activeTab, selectedTags, page],
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          articles: oldData.articles.map((article: any) =>
            article.slug === slug
              ? {
                  ...article,
                  favorited,
                  favoritesCount: article.favoritesCount + (favorited ? 1 : -1),
                }
              : article
          ),
        };
      }
    );
  };

  const likeMutation = useMutation({
    mutationFn: (slug: string) => likeArticle(slug),
    onMutate: (slug: string) => updateArticleOptimistically(slug, true),
    onError: (_, slug) => updateArticleOptimistically(slug, false),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles", activeTab, ...selectedTags, page],
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (slug: string) => unlikeArticle(slug),
    onMutate: (slug: string) => updateArticleOptimistically(slug, false),
    onError: (_, slug) => updateArticleOptimistically(slug, true),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles", activeTab, ...selectedTags, page],
      });
    },
  });

  return {
    articles,
    isLoading,
    error,
    likeMutation,
    unlikeMutation,
    authToken,
    selectedTags,
    page,
    limit,
    activeTab,
    user: authToken,
  };
};
