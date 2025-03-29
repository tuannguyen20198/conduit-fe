import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArticles, likeArticle, unlikeArticle } from "@/lib/api";

export const useArticles = (
  activeTab: "your" | "global",
  selectedTags: string[] = [],
  page: number = 1,
  limit: number = 5
) => {
  const offset = (page - 1) * limit;
  const queryClient = useQueryClient();

  // Fetch danh sách bài viết
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", activeTab, selectedTags, page],
    queryFn: () =>
      getArticles({
        ...(activeTab === "your" ? { favorited: "your-feed" } : {}),
        ...(selectedTags.length > 0 ? { tag: selectedTags.join(",") } : {}),
        limit,
        offset,
      }),
    initialData: { articles: [], articlesCount: 0 },
  });

  // Hàm cập nhật bài viết ngay lập tức để tránh delay UI
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

  // Xử lý Like bài viết
  const likeMutation = useMutation({
    mutationFn: (slug: string) => likeArticle(slug),
    onMutate: async (slug: string) => {
      updateArticleOptimistically(slug, true);
    },
    onError: (_, slug) => {
      updateArticleOptimistically(slug, false); // Rollback nếu lỗi
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles", activeTab, ...selectedTags, page],
      });
    },
  });

  // Xử lý Unlike bài viết
  const unlikeMutation = useMutation({
    mutationFn: (slug: string) => unlikeArticle(slug),
    onMutate: async (slug: string) => {
      updateArticleOptimistically(slug, false);
    },
    onError: (_, slug) => {
      updateArticleOptimistically(slug, true); // Rollback nếu lỗi
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles", activeTab, ...selectedTags, page],
      });
    },
  });

  return { articles, isLoading, error, likeMutation, unlikeMutation };
};
