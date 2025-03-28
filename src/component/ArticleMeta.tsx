import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArticleBySlug } from "@/lib/api";

const ArticleMeta = () => {
  const { slug } = useParams();
  const safeSlug = slug ?? ""; // Đảm bảo `slug` không bị undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ["article", safeSlug],
    queryFn: () => getArticleBySlug(safeSlug),
    enabled: !!safeSlug, // Chỉ fetch khi `slug` hợp lệ
  });

  if (isLoading) return <p>Loading article...</p>;
  if (error) return <p className="error-message">Failed to load article.</p>;
  if (!data?.article) return <p>No article found.</p>;

  // Lấy `article` từ API response
  const article = data.article;
  const author = article.author ?? {}; // Đảm bảo `author` không bị undefined

  return (
<div className="article-page">
      {/* Banner */}
      <div className="banner">
        <div className="container">
          <h1 data-testid="article-title">{article.title}</h1>
          <div className="article-meta">
            <a href={`/profile/${author.username}`} data-testid="article-author">
              <img src={author.image ?? "https://static.productionready.io/images/smiley-cyrus.jpg"} alt={author.username} />
            </a>
            <div className="info">
              <a href={`/profile/${author.username}`} className="author">{author.username}</a>
              <span className="date">{new Date(article.createdAt).toDateString()}</span>
            </div>
            <span>
              <button className="btn btn-sm action-btn btn-outline-secondary">
                <i className="ion-plus-round"></i> &nbsp; Follow {author.username}
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-sm btn-outline-primary">
                <i className="ion-heart"></i> &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleMeta;
