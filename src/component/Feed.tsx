import React, { useState } from "react";
import { useFeed } from "@/hook/useFeeds";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTags } from "@/hook/useTags";
import { useAuth } from "@/context/AuthContext";

const Feed = () => {
  const [activeTab, setActiveTab] = useState<"your" | "global">("global");
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const { user: authToken } = useAuth();

  // Chỉ gọi API khi user đăng nhập nếu chọn tab "your"
  const { articles, isLoading, likeMutation, unlikeMutation, error } = useFeed(
    activeTab === "your" ? (authToken ? "your" : "global") : "global",
    selectedTag,
    currentPage,
    articlesPerPage
  );

  const { data: tags } = useTags();
  const totalArticles = articles?.articlesCount || 0;
  const pageCount = Math.max(1, Math.ceil(totalArticles / articlesPerPage));

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleLikeToggle = (slug: string, isFavorited: boolean) => {
    if (!authToken) {
      alert("Please log in to like articles.");
      return;
    }
    if (isFavorited) {
      unlikeMutation.mutate(slug);
    } else {
      likeMutation.mutate(slug);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag([tag]); // Only allow one tag selection at a time
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-9">
          <div className="feed-toggle">
            <ul className="nav nav-pills outline-active">
              {authToken && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "your" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("your");
                      setSelectedTag([]);
                      setCurrentPage(1);
                    }}
                  >
                    Your Feed
                  </button>
                </li>
              )}
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "global" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("global");
                    setSelectedTag([]);
                    setCurrentPage(1);
                  }}
                >
                  Global Feed
                </button>
              </li>
            </ul>
          </div>

          {isLoading && <p>Loading articles...</p>}
          {error && <p className="error-message">Failed to load articles.</p>}

          {!isLoading && articles?.articles?.length === 0 && <p>No articles in this section.</p>}
          {articles?.articles?.map((article: any) => (
            (
              <div key={article.slug} className="article-preview">
                <div className="article-meta">
                  <Link to={`/profile/${article.author.username}`}>
                    <img src={article.author.image} alt={article.author.username} />
                  </Link>
                  <div className="info">
                    <Link to={`/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </Link>
                    <span className="date">{new Date(article.createdAt).toDateString()}</span>
                  </div>
                  <button className="btn btn-outline-primary btn-sm pull-xs-right" onClick={() => handleLikeToggle(article.slug, article.favorited)}>
                    <i className="ion-heart" /> {article.favoritesCount}
                  </button>
                </div>
                <Link to={`/article/${article.slug}`} className="preview-link">
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    {article.tagList.length > 0 ? (
                      article.tagList.map((tag: string) => (
                        <li
                          key={tag}
                          className={`tag-default tag-pill tag-outline ${selectedTag.includes(tag) ? "active" : ""
                            }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </li>
                      ))
                    ) : (
                      <p>No tags available</p>
                    )}
                  </ul>
                </Link>
              </div>
            )
          ))}

          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
              disabledClassName={"disabled"}
            />
          )}
        </div>

        <div className="col-md-3 order-md-last cursor-pointer">
          <Sidebar
            tags={tags || []}
            selectedTags={selectedTag}
            setSelectedTags={setSelectedTag}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;
