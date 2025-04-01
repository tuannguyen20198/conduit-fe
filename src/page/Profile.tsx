import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="profile-page">
      {/* User Info Section */}
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {/* User Image */}
              <img 
                src="http://i.imgur.com/Qr71crq.jpg" 
                alt="User's profile" 
                className="user-img" 
              />
              <h4>Eric Simons</h4>
              <p>
                Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from
                the Hunger Games
              </p>
              {/* Follow Button */}
              <button className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-plus-round" />
                &nbsp; Follow Eric Simons
              </button>
              {/* Edit Profile Settings Link */}
              <Link to={'/settings'} className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-gear-a" />
                &nbsp; Edit Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            {/* Articles Toggle */}
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link to="" className="nav-link active">My Articles</Link>
                </li>
                <li className="nav-item">
                  <Link to="" className="nav-link">Favorited Articles</Link>
                </li>
              </ul>
            </div>

            {/* Article Previews */}
            <div className="article-preview">
              {/* Article 1 */}
              <div className="article-meta">
                <Link to="/profile/eric-simons">
                  <img 
                    src="http://i.imgur.com/Qr71crq.jpg" 
                    alt="Eric Simons" 
                  />
                </Link>
                <div className="info">
                  <Link to="/profile/eric-simons" className="author">Eric Simons</Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 29
                </button>
              </div>
              <Link to="/article/how-to-buil-webapps-that-scale" className="preview-link">
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">realworld</li>
                  <li className="tag-default tag-pill tag-outline">implementations</li>
                </ul>
              </Link>
            </div>

            {/* Article 2 */}
            <div className="article-preview">
              <div className="article-meta">
                <Link to="/profile/albert-pai">
                  <img 
                    src="http://i.imgur.com/N4VcUeJ.jpg" 
                    alt="Albert Pai" 
                  />
                </Link>
                <div className="info">
                  <Link to="/profile/albert-pai" className="author">Albert Pai</Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 32
                </button>
              </div>
              <Link to="/article/the-song-you" className="preview-link">
                <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">Music</li>
                  <li className="tag-default tag-pill tag-outline">Song</li>
                </ul>
              </Link>
            </div>

            {/* Pagination */}
            <ul className="pagination">
              <li className="page-item active">
                <Link className="page-link" to="">1</Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="">2</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
