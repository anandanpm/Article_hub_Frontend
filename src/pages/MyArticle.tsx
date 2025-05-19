import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Search, Eye } from 'lucide-react'
import "./MyArticle.scss"
import { useSelector } from "react-redux"
import userApi from "../api/userApi"
import type { ReduxData, ArticleDetails } from "../entities/interface"

const MyArticles: React.FC = () => {
  const [articles, setArticles] = useState<ArticleDetails[]>([])
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const articlesPerPage = 3
  const userId = useSelector((state: ReduxData) => state.user.user.id)

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (!userId) {
        setError("User ID not found. Please log in.")
        setLoading(false)
        return
      }

      try {
        const response = await userApi.getArticle(userId)
        // Check if response has articles directly or in the data property
        const articlesData = response.articles || (response.data && response.data.articles)
        
        if (articlesData && articlesData.length > 0) {
          setArticles(articlesData)
        } else {
          setError("No articles found")
        }
        setLoading(false)
      } catch (error: any) {
        console.error("Error fetching articles:", error)
        setError(error.response?.data?.message || "Failed to load articles")
        setLoading(false)
      }
    }

    fetchArticles()
  }, [userId])

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleViewArticle = (article: ArticleDetails) => {
    setSelectedArticle(article)
  }

  const handleBackToList = () => {
    setSelectedArticle(null)
  }

  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.category && article.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return (
      <div className="articles-container loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="articles-container error">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    )
  }

  // Display single article detail view
  if (selectedArticle) {
    return (
      <div className="article-detail-container">
        <div className="article-header">
          <div className="article-meta">
            <div className = 'article-back'>
            {selectedArticle.category && (
              <span className="article-category">{selectedArticle.category}</span>
            )}
             <button className="back-button" onClick={handleBackToList}>
          <ArrowLeft size={18} />
          Back to My Articles
        </button>
        </div>
            <h1 className="article-title">{selectedArticle.title}</h1>
            <div className="article-info">
              {selectedArticle.createdAt && (
                <div className="info-item">
                  <span>Published on {formatDate(selectedArticle.createdAt)}</span>
                </div>
              )}
                
              <div className="info-item">
                <span>{selectedArticle.totalReaders || 0} readers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="article-image-container">
          <img
            src={selectedArticle.imageUrl || "/api/placeholder/800/400"}
            alt={selectedArticle.title}
            className="article-image"
          />
        </div>

        <div className="article-content">
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="article-tags">
              {selectedArticle.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
          {selectedArticle.description && (
                <div className="article-description">
                  <span> {selectedArticle.description}</span>
                </div>
              )}

          <div className="article-engagement">
            <h3 className="engagement-title">Article Statistics</h3>
            <div className="engagement-stats">
              <div className="stat-item">
                <div className="stat-count">{selectedArticle.likes || 0}</div>
                <div className="stat-label">Likes</div>
              </div>
              <div className="stat-item">
                <div className="stat-count">{selectedArticle.dislikes || 0}</div>
                <div className="stat-label">Dislikes</div>
              </div>
              <div className="stat-item">
                <div className="stat-count">{selectedArticle.blocks || 0}</div>
                <div className="stat-label">Blocks</div>
              </div>
              <div className="stat-item">
                <div className="stat-count">{selectedArticle.totalReaders || 0}</div>
                <div className="stat-label">Readers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Display articles list view as a table
  return (
    <div className="articles-list-container">
      <h1 className="page-title">Article Status</h1>
      
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="table-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>CATEGORY</th>
              <th>TAGS</th>
              <th>PUBLISHED</th>
              <th>READERS</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.length > 0 ? (
              currentArticles.map(article => (
                <tr key={article.id}>
                  <td className="image-cell">
                    <img 
                      src={article.imageUrl || "/api/placeholder/60/60"} 
                      alt={article.title}
                      className="article-thumbnail"
                    />
                  </td>
                  <td>{article.title}</td>
                  <td>{article.category}</td>
                  <td>
                    <div className="tags-cell">
                      {article.tags && article.tags.map((tag, index) => (
                        <span key={index} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>{formatDate(article.createdAt)}</td>
                  <td>{article.totalReaders || 0}</td>
                  <td><span className="status-badge active">Active</span></td>
                  <td>
                    <button 
                      className="view-button"
                      onClick={() => handleViewArticle(article)}
                    >
                      <Eye size={18} />
                      VIEW
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-articles">No articles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-arrow"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
          
          <button 
            className="pagination-arrow"
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default MyArticles