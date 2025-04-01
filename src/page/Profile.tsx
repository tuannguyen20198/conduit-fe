import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useFeeds from "@/hook/useFeeds";
import { Navigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Spinner from "@/component/Spinner";
import {  getArticles } from "@/lib/api";

const Profile = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    error, 
    handleLike, 
    handleFollow, 
    pageCount, 
    handlePageClick, 
    currentPage,
  } = useFeeds();

  const [articles, setArticles] = useState<any[]>([]); // Define articles and setArticles

  // State để lưu trạng thái tab hiện tại
  const [activeTab, setActiveTab] = useState<'myArticles' | 'favoritedArticles'>('myArticles');

  // Nếu không có user, điều hướng tới trang login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Số lượng bài viết trên mỗi trang
  const articlesPerPage = 10;

  // Fetch lại bài viết khi tab thay đổi
  useEffect(() => {
    if (activeTab === 'myArticles') {
      getArticles({ author: user.username, limit: 10, offset: (currentPage - 1) * articlesPerPage }) 
        .then(response => {
          // Lọc bài viết của người dùng
          const myArticles = response.articles.filter(article => article.author.username === user.username);
          setArticles(myArticles); // Lưu bài viết của người dùng vào state
        });
    } else {
      getArticles({ favorited: user.username, limit: 10, offset: (currentPage - 1) * articlesPerPage })
        .then(response => {
          setArticles(response.articles); // Lưu bài viết đã yêu thích vào state
        });
    }
  }, [activeTab, currentPage, user.username]);
  

  const handleTabClick = (tab: 'myArticles' | 'favoritedArticles') => {
    setActiveTab(tab); // Thay đổi tab hiện tại
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="profile-header">
                <img
                  src={user?.image || "http://i.imgur.com/Qr71crq.jpg"}
                  className="user-img"
                  alt="User Image"
                />
                <div className="user-details">
                  <h4>{user?.username}</h4>
                  <p>{user?.bio || "This user hasn't written a bio yet."}</p>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-outline-primary action-btn">
                      <i className="ion-plus-round"></i> Follow {user?.username}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary action-btn">
                      <i className="ion-gear-a"></i> Edit Profile Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a 
                    className={`nav-link ${activeTab === 'myArticles' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('myArticles')}
                    href="#"
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className={`nav-link ${activeTab === 'favoritedArticles' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('favoritedArticles')}
                    href="#"
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {isLoading && <Spinner />}
            {error && <div>{error}</div>}

            {articles.map((article: any) => (
              <div className="article-preview" key={article.slug}>
                <div className="article-meta">
                  <a href={`/profile/${article.author.username}`}>
                    <img src={article.author.image || "http://i.imgur.com/Qr71crq.jpg"} alt={article.author.username} />
                  </a>
                  <div className="info">
                    <a href={`/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">{article.createdAt}</span>
                  </div>
                  <button 
                    className="btn btn-outline-primary btn-sm pull-xs-right" 
                    onClick={() => handleLike(article.slug, article.favorited, article.favoritesCount)}
                  >
                    <i className="ion-heart"></i> {article.favoritesCount}
                  </button>
                </div>
                <a href={`/article/${article.slug}`} className="preview-link">
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    {article.tagList.map((tag: string) => (
                      <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
                    ))}
                  </ul>
                </a>
              </div>
            ))}

            {!isLoading && (
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                forcePage={currentPage - 1} // Giúp ReactPaginate cập nhật ngay lập tức
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="hidden"
                nextLinkClassName="hidden"
                activeClassName="active"
                disabledClassName="disabled"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
