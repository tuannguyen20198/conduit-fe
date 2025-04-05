import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axiosConfig';
import ReactMarkdown from 'react-markdown';
import { useFollow } from '@/context/FollowContext';
import rehypeRaw from 'rehype-raw';
import Comment from '@/component/Comment';

interface Author {
  username: string;
  image: string;
}

interface Article {
  [x: string]: any;
  title: string;
  body: string;
  createdAt: string;
  author: Author;
  favoritesCount: number;
  tagList: string[];
  slug: string;
}

const Article = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { following, setFollowing } = useFollow();
  const isFollowing = article ? following[article.author.username] || false : false;

  // Fetch article when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.post(`/articles/${slug}`);
        setArticle(response.data.article.article);
        setLoading(false);
      } catch (error) {
        setError('Failed to load article');
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Sync follow status from localStorage on mount
  useEffect(() => {
    const savedFollowData = localStorage.getItem("followingData");
    if (savedFollowData) {
      const parsedFollowData = JSON.parse(savedFollowData);
      if (article) {
        const isUserFollowing = parsedFollowData[article.author.username] || false;
        setFollowing(article.author.username, isUserFollowing);
      }
    }
  }, [article?.author?.username, setFollowing]);

  // Update follow status in localStorage whenever it changes
  useEffect(() => {
    if (article) {
      localStorage.setItem("followingData", JSON.stringify(following));
    }
  }, [following, article]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async (username: string) => {
    try {
      if (isFollowing) {
        await handleUnfollow(username);
      } else {
        await api.post(`/profiles/${username}/follow`);
        setFollowing(username, true);
        alert('Followed successfully');
      }
    } catch (err) {
      alert('Error while following user');
    }
  };

  const handleUnfollow = async (username: string) => {
    try {
      await api.delete(`/profiles/${username}/follow`);
      setFollowing(username, false);
      alert('Unfollowed successfully');
    } catch (err) {
      alert('Error while unfollowing user');
    }
  };

  // Handle favorite article
  const handleFavorite = async () => {
    try {
      const response = await api.post(`/articles/${slug}/favorite`);
      setArticle((prevArticle) =>
        prevArticle
          ? {
              ...prevArticle,
              favoritesCount: response.data.article.favoritesCount,
            }
          : prevArticle
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Handle delete article
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        if (user && article?.author.username === user.username) {
          await api.delete(`/articles/${slug}`);
          alert('Article deleted');
          navigate('/'); // Redirect to homepage after deletion
        } else {
          alert('You can only delete your own article');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found.</div>;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <a href={`/profile/${article.author?.username}`}>
              <img src={article.author?.image || 'http://i.imgur.com/Qr71crq.jpg'} alt="author" />
            </a>
            <div className="info">
              <a href={`/profile/${article.author?.username}`} className="author">
                {article.author?.username}
              </a>
              <span className="date">{article.createdAt}</span>
            </div>

            {user && user?.username !== article.author?.username && (
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleFollowToggle(article.author?.username)}>
                <i className={isFollowing ? 'ion-minus-round' : 'ion-plus-round'} />
                &nbsp; {isFollowing ? `Unfollow ${article.author?.username}` : `Follow ${article.author?.username}`}
              </button>
            )}

            <button className="btn btn-sm btn-outline-primary" onClick={handleFavorite}>
              <i className="ion-heart" />
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>

            {user && user?.username === article.author?.username && (
              <>
                <button className="btn btn-sm btn-outline-secondary">
                  <Link to={`/editor/${article.slug}`}><i className="ion-edit"></i> Edit Article</Link>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                  <i className="ion-trash-a" /> Delete Article
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.body}</ReactMarkdown>
            <ul className="tag-list">
              {article.tagList?.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <Comment />
    </div>
  );
};

export default Article;
