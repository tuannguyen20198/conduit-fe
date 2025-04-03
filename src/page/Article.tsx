import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import api from '@/lib/axiosConfig';

// Định nghĩa kiểu cho bài viết (Article)
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
  slug: string; // Đảm bảo slug tồn tại trong dữ liệu bài viết
}

const Article = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại
  const { slug } = useParams(); // Lấy slug của bài viết từ URL
  const navigate = useNavigate(); // Sử dụng `useNavigate` thay vì `history.push`

  const [article, setArticle] = useState<Article | null>(null); // Chỉ định kiểu dữ liệu cho `article`
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi khi gọi API
  console.log(article);

  // Gọi API để lấy bài viết
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${slug}`);
        setArticle(response.data.article.article); // Lưu trữ dữ liệu bài viết vào state
        setLoading(false); // Đổi trạng thái loading
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle(); // Chỉ gọi khi slug có giá trị
    }
  }, [slug]); // Chỉ gọi lại khi `slug` thay đổi

  // Handle follow user
  const handleFollow = async (username: string) => {
    try {
      const response = await api.post(`/profiles/${username}/follow`);
    //   return response.data;
      alert('Followed successfully');
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
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
        // Kiểm tra nếu người dùng là tác giả của bài viết trước khi cho phép xóa
        if (user && article?.author.username === user.username) {
          await api.delete(`/articles/${slug}`);
          alert('Article deleted');
          navigate('/'); // Chuyển hướng về trang chủ sau khi xóa bài viết
        } else {
          alert('You can only delete your own article');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
  if (error) return <div>Error: {error}</div>; // Hiển thị lỗi nếu có

  if (!article) return <div>Article not found.</div>; // Nếu không có bài viết, thông báo lỗi

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

            {/* Kiểm tra nếu người dùng không phải là tác giả thì hiển thị nút Follow */}
            {user && user?.username !== article.author?.username && (
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleFollow(article.author?.username)}>
                <i className="ion-plus-round" />
                &nbsp; Follow {article.author?.username}
              </button>
            )}

            {/* Hiển thị nút Favorite cho tất cả người dùng */}
            <button className="btn btn-sm btn-outline-primary" onClick={handleFavorite}>
              <i className="ion-heart" />
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>

            {/* Kiểm tra nếu người dùng là tác giả bài viết thì mới hiển thị nút Edit và Delete */}
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
            <p>{article.body}</p>
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
    </div>
  );
};

export default Article;
