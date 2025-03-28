import React, { useState } from "react";
import { useArticles } from "@/hook/useArticles";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

const Feed = () => {
  const [activeTab, setActiveTab] = useState<"your" | "global">("global");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const { articles, isLoading, error, tags } = useArticles(activeTab, selectedTag);

  return (
    <div className="container page">
      <div className="row">
        {/* Feed - Danh sách bài viết */}
        <div className="col-md-9">
          {/* Tab Navigation */}
          <div className="feed-toggle">
            <ul className="nav nav-pills outline-active">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "your" ? "active" : ""}`}
                  onClick={() => { setActiveTab("your"); setSelectedTag(undefined); }}
                >
                  Your Feed
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "global" ? "active" : ""}`}
                  onClick={() => { setActiveTab("global"); setSelectedTag(undefined); }}
                >
                  Global Feed
                </button>
              </li>
            </ul>
          </div>

          {/* Loading & Error */}
          {isLoading && <p>Loading articles...</p>}
          {error && <p className="error-message">Failed to load articles.</p>}

          {/* Display articles */}
          {!isLoading && articles?.articles?.length === 0 && <p>No articles in this section.</p>}
          {articles?.articles?.map((article: any) => (
            <div key={article.slug} className="article-preview">
              <div className="article-meta">
                <Link to={`/profile/${article.author.username}`}>
                  <img src={article.author.image} alt={article.author.username} />
                </Link>
                <div className="info">
                  <Link to={`/profile/${article.author.username}`} className="author">
                    {article.author.username}
                  </Link>
                  <span className="date">
                    {new Date(article.createdAt).toDateString()}
                  </span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
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
                      className={`tag-default tag-pill tag-outline ${selectedTag === tag ? "active" : ""}`}
                      onClick={() => {
                        setSelectedTag(tag);
                        setActiveTab("global");
                      }}
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
          ))}
        </div>

        {/* Sidebar - Chuyển sang phải bằng order-md-last */}
        <div className="col-md-3 order-md-last cursor-pointer">
          <Sidebar tags={tags?.tags || []} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
        </div>
      </div>
    </div>
  );
};

export default Feed;
