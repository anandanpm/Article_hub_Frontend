

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Search, Edit, Trash2, Save, X, Upload } from 'lucide-react'
import "./ArticleEdit.scss"
import { useSelector } from "react-redux"
import userApi from "../api/userApi"
import uploadImageToCloudinary from "../config/Cloudinary"
import type { ReduxData, ArticleDetails } from "../entities/interface"

const ArticleEdit: React.FC = () => {
  const [articles, setArticles] = useState<ArticleDetails[]>([])
  const [, setSelectedArticle] = useState<ArticleDetails | null>(null)
  const [editingArticle, setEditingArticle] = useState<ArticleDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const articlesPerPage = 3
  const userId = useSelector((state: ReduxData) => state.user.user.id)

  // Fetch articles
  useEffect(() => {
    fetchArticles()
  }, [userId])

  const fetchArticles = async () => {
    if (!userId) {
      setError("User ID not found. Please log in.")
      setLoading(false)
      return
    }

    try {
      const response = await userApi.getArticle(userId)
      
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEditArticle = (article: ArticleDetails) => {
    setEditingArticle({...article})
    setSelectedArticle(null)
    setDeleteConfirmation(null)
  }

  const handleDeletePrompt = (articleId: string) => {
    setDeleteConfirmation(articleId)
  }

  const handleCancelDelete = () => {
    setDeleteConfirmation(null)
  }

  const handleDeleteArticle = async (articleId: string) => {
    try {
     let result =  await userApi.deleteArticle(articleId)
      console.log(result,'is the delete is the done or not')
      // Update local state after successful deletion
      setArticles(articles.filter(article => article.id !== articleId))
      setDeleteConfirmation(null)
      
      // Show success notification (implement as needed)
      console.log("Article deleted successfully")
    } catch (error: any) {
      console.error("Error deleting article:", error)
      // Show error notification (implement as needed)
      alert(error.response?.data?.message || "Failed to delete article")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        [field]: e.target.value
      })
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingArticle) {
      // Convert comma-separated string to array
      const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      setEditingArticle({
        ...editingArticle,
        tags: tagsArray
      })
    }
  }

  const handleImageClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingArticle || !e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    
    try {
      setUploadingImage(true)
      const imageUrl = await uploadImageToCloudinary(file)
      
      setEditingArticle({
        ...editingArticle,
        imageUrl
      })
      setUploadingImage(false)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadingImage(false)
      alert("Failed to upload image. Please try again.")
    }
  }

  const handleSaveArticle = async () => {
    if (!editingArticle) return

    try {
      setLoading(true)
      await userApi.updateArticle(editingArticle.id, editingArticle)
      
      // Update local state after successful update
      setArticles(articles.map(article => 
        article.id === editingArticle.id ? editingArticle : article
      ))
      
      setEditingArticle(null)
      setLoading(false)
      
      // Show success notification (implement as needed)
      console.log("Article updated successfully")
    } catch (error: any) {
      console.error("Error updating article:", error)
      setLoading(false)
      // Show error notification (implement as needed)
      alert(error.response?.data?.message || "Failed to update article")
    }
  }

  const handleBackToList = () => {
    setSelectedArticle(null)
    setEditingArticle(null)
    setDeleteConfirmation(null)
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

  // Display edit article form
  if (editingArticle) {
    return (
      <div className="article-edit-container">
        <div className="article-header">
          <div className="article-meta">
            <div className="article-back">
              <button className="back-button" onClick={handleBackToList}>
                <ArrowLeft size={18} />
                Back to My Articles
              </button>
              <h1 className="edit-title">Edit Article</h1>
            </div>
          </div>
        </div>

        <div className="edit-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={editingArticle.title} 
              onChange={(e) => handleInputChange(e, 'title')}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input 
              type="text" 
              value={editingArticle.category || ''} 
              onChange={(e) => handleInputChange(e, 'category')}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input 
              type="text" 
              value={editingArticle.tags?.join(', ') || ''} 
              onChange={handleTagsChange}
              className="form-control"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              value={editingArticle.description || ''} 
              onChange={(e) => handleInputChange(e, 'description')}
              className="form-control"
              placeholder="Article description"
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <div className="image-upload-container">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload} 
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div 
                className="image-preview-upload" 
                onClick={handleImageClick}
              >
                {uploadingImage ? (
                  <div className="upload-loading">Uploading...</div>
                ) : (
                  <>
                    <img
                      src={editingArticle.imageUrl || "/api/placeholder/400/200"}
                      alt="Article preview"
                      className="preview-image"
                    />
                    <div className="upload-overlay">
                      <Upload size={24} />
                      <span>Click to upload new image</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={handleBackToList}>
              <X size={18} />
              Cancel
            </button>
            <button className="save-button" onClick={handleSaveArticle}>
              <Save size={18} />
              Save Changes
            </button>
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
                  <td className="actions-cell">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditArticle(article)}
                    >
                      <Edit size={16} />
                      EDIT
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeletePrompt(article.id)}
                    >
                      <Trash2 size={16} />
                      DELETE
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

      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={() => handleDeleteArticle(deleteConfirmation)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleEdit