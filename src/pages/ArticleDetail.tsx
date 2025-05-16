import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import './ArticleDetail.scss';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  description?: string;
  category: string;
  tags?: string[];
  image: string;
  author: string;
  authorId?: string;
  date: string;
  createdAt?: string;
}

const ArticleDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state as { article: Article };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="article-detail-container">
      <button className="back-button" onClick={handleGoBack}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="article-header">
        <div className="article-meta">
          <span className="article-category">{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-info">
            <div className="info-item">
              <User size={18} />
              <span>{article.author}</span>
            </div>
            <div className="info-item">
              <Calendar size={18} />
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="article-image-container">
        <img 
          src={article.image} 
          alt={article.title} 
          className="article-image" 
        />
      </div>

      <div className="article-content">
        <p className="article-excerpt">{article.excerpt}</p>
        
        {article.description && (
          <div className="article-description">
            {article.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            <Tag size={18} />
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="article-footer">
          <div className="creation-info">
            {article.createdAt && (
              <p className="created-at">
                Published on {formatDate(article.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;