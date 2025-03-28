import { useQuery } from "@tanstack/react-query";
import { getArticles, getTags } from "@/lib/api";

export const useArticles = (
  activeTab: "your" | "global",
  selectedTag?: string
) => {
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", activeTab, selectedTag],
    queryFn: () =>
      getArticles({
        ...(activeTab === "your" ? { author: "your-feed" } : {}),
        ...(selectedTag ? { tag: selectedTag } : {}),
      }),
    // Optionally, you can add `initialData` to handle empty state.
    initialData: [],
  });

  // Fetch tags
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    initialData: [],
  });

  return { articles, isLoading, error, tags };
};
