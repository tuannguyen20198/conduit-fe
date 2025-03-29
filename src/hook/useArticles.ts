import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/api";

export const useArticles = (
  activeTab: "your" | "global",
  selectedTags: string[] = [], // selectedTags là mảng chứa các tag đã chọn
  page: number = 1,
  limit: number = 5
) => {
  const offset = (page - 1) * limit;

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", activeTab, selectedTags, page],
    queryFn: () =>
      getArticles({
        ...(activeTab === "your" ? { author: "your-feed" } : {}),
        ...(selectedTags.length > 0 ? { tag: selectedTags.join(",") } : {}),
        limit,
        offset,
      }),
    initialData: { articles: [], articlesCount: 0 },
  });

  return { articles, isLoading, error };
};
