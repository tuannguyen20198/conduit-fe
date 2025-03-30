export interface ArticleFormData {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  author: Author;
  favorited: boolean;
  favoritesCount: number;
  tagList: string[];
}
