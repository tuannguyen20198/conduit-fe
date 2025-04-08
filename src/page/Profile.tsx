import { useAuth } from "@/context/AuthContext";
import { Link, Navigate, useParams } from "react-router-dom";
import Spinner from "@/component/Spinner";
import ReactPaginate from "react-paginate";
import FollowButton from "@/component/FollowButton";
import useProfile from "@/hook/useProfile";

const Profile = () => {
  const { user } = useAuth();
  const { username } = useParams();

  // Using the combined useProfile hook
  const {
    profileData,
    articlesData,
    isLoading,
    error,
    activeTab,
    currentPage,
    pageCount,
    handleTabClick,
    handlePageClick,
  } = useProfile(username!);

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="profile-header">
                <img
                  src={profileData?.image || "http://i.imgur.com/Qr71crq.jpg"}
                  className="user-img"
                  alt="User Image"
                />
                <div className="user-details">
                  <h4>{profileData?.username}</h4>
                  <p>{profileData?.bio || "This user hasn't written a bio yet."}</p>
                  <div className="action-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {profileData?.username !== user?.username && (
                      <FollowButton profileUsername={profileData?.username || ""} />
                    )}
                    <button className="btn btn-sm btn-outline-secondary action-btn">
                      <Link to="/settings"><i className="ion-gear-a"></i> Edit Profile Settings</Link>
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
            {error && <div>{error.message || String(error)}</div>}

            {articlesData.length === 0 ? (
              <div className="no-articles">
                <h4>No articles to display.</h4>
              </div>
            ) : (
              articlesData.slice((currentPage - 1) * 10, currentPage * 10).map((article: any) => (
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
                      disabled={activeTab === 'myArticles'}
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
              ))
            )}

            {!isLoading && (
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                forcePage={currentPage - 1}
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
