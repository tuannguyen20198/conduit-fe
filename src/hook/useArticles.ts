import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/api";

export const useArticles = (
  activeTab: "your" | "global",
  selectedTag?: string,
  page: number = 1,
  limit: number = 5
) => {
  const offset = (page - 1) * limit;

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", activeTab, selectedTag, page],
    queryFn: () =>
      getArticles({
        ...(activeTab === "your" ? { author: "your-feed" } : {}),
        ...(selectedTag ? { tag: selectedTag } : {}),
        limit,
        offset,
      }),
    initialData: { articles: [], articlesCount: 0 },
  });

  return { articles, isLoading, error };
};
