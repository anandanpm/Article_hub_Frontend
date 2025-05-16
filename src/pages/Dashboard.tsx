
import { useState, useEffect } from "react"
import { Heart, ThumbsDown, X, AlertCircle } from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" // Import for navigation
import "./dashboard.scss"
import userApi from "../api/userApi"
import type { ReduxData } from "../entities/interface"

interface Article {
  id: string
  title: string
  excerpt: string
  description?: string
  category: string
  tags?: string[]
  image: string
  author: string
  authorId?: string
  date: string
  createdAt?: string
  userInteraction?: {
    isLiked?: boolean
    isDisliked?: boolean
    isBlocked?: boolean
  }
}

interface PopupProps {
  article: Article
  action: "like" | "dislike" | "block"
  onConfirm: () => void
  onCancel: () => void
}

const ActionPopup = ({ article, action, onConfirm, onCancel }: PopupProps) => {
  const actionText = {
    like: "like",
    dislike: "dislike",
    block: "block",
  }

  const actionIcon = {
    like: <Heart className="popup-icon like" />,
    dislike: <ThumbsDown className="popup-icon dislike" />,
    block: <X className="popup-icon block" />,
  }

  // Regular action confirmation popup
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Confirm Action</h3>
          <button className="close-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="popup-content">
          {actionIcon[action]}
          <p>Are you sure you want to {actionText[action]} this article?</p>
          <h4>{article.title}</h4>
        </div>
        <div className="popup-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate() // Hook for navigation
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [popup, setPopup] = useState<{
    show: boolean
    article: Article | null
    action: "like" | "dislike" | "block" | null
  }>({
    show: false,
    article: null,
    action: null,
  })
  const userId = useSelector((state: ReduxData) => state.user.user.id)

  // Get user preferences from Redux store
  const userPreferences = useSelector((state: any) => state.user.user.articlePreferences || [])

  // Fetch articles based on user preferences
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)

        // Send API request with user preferences and userId
        const response = await userApi.getArticlesByPreferences(userPreferences, userId)
        console.log(response, "the response is coming from the api")

        // Handle the response data properly
        // Check if response is array or has data property
        const articlesData = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
            ? response.data
            : Object.values(response).filter((item) => typeof item === "object")

        setArticles(articlesData as Article[])  // Type assertion to ensure it matches Article[]
        setError(null)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setError("Failed to load articles. Please try again later.")
        // Fallback to mock data in case of error
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    if (userPreferences.length > 0) {
      fetchArticles()
    } else {
      setArticles([])
      setLoading(false)
    }
  }, [userPreferences, userId])

  // Navigate to the article details page
  const handleViewArticle = (article: Article) => {
    navigate(`/article/${article.id}`, { state: { article } })
  }

  const handleAction = (article: Article, action: "like" | "dislike" | "block") => {
    setPopup({
      show: true,
      article,
      action,
    })
  }

  const handleDirectAction = async (article: Article, action: "like" | "dislike" | "block") => {
    try {
      switch (action) {
        case "like":
                      // If already liked, unlike it
          if (article.userInteraction?.isLiked) {
            await userApi.likeArticle(article.id, userId)

            setArticles(
              articles.map((a) => {
                if (a.id === article.id) {
                  return {
                    ...a,
                    userInteraction: {
                      ...(a.userInteraction || {}),
                      isLiked: false,
                    },
                  } as Article
                }
                return a
              }),
            )
          } else {
            // Like the article
            await userApi.likeArticle(article.id, userId)

            setArticles(
              articles.map((a) => {
                if (a.id === article.id) {
                  return {
                    ...a,
                    userInteraction: {
                      ...(a.userInteraction || {}),
                      isLiked: true,
                      isDisliked: false, // Remove dislike if present
                    },
                  } as Article
                }
                return a
              }),
            )
          }
          break

        case "dislike":
          // If already disliked, un-dislike it
          if (article.userInteraction?.isDisliked) {
            await userApi.dislikeArticle(article.id, userId)

            setArticles(
              articles.map((a) => {
                if (a.id === article.id) {
                  return {
                    ...a,
                    userInteraction: {
                      ...(a.userInteraction || {}),
                      isDisliked: false,
                    },
                  } as Article
                }
                return a
              }),
            )
          } else {
            // Dislike the article
            await userApi.dislikeArticle(article.id, userId)

            setArticles(
              articles.map((a) => {
                if (a.id === article.id) {
                  return {
                    ...a,
                    userInteraction: {
                      ...(a.userInteraction || {}),
                      isDisliked: true,
                      isLiked: false, // Remove like if present
                    },
                  } as Article
                }
                return a
              }),
            )
          }
          break

        case "block":
          // For block, we'll still use the popup for confirmation
          handleAction(article, "block")
          break
      }
    } catch (err) {
      console.error(`Error performing direct ${action} action:`, err)
    }
  }

  const confirmAction = async () => {
    if (!popup.article || !popup.action) return

    try {
      // Call the appropriate API based on the action
      switch (popup.action) {
        case "like":
          await userApi.likeArticle(popup.article.id, userId)
          console.log(`Liked article ID: ${popup.article.id}`)

          // Update local state for the liked article
          setArticles(
            articles.map((article) => {
              if (article.id === popup.article?.id) {
                return {
                  ...article,
                  userInteraction: {
                    ...(article.userInteraction || {}),
                    isLiked: true,
                    // If it was disliked before, remove the dislike when liking
                    isDisliked: false,
                  },
                } as Article
              }
              return article
            }),
          )
          break

        case "dislike":
          await userApi.dislikeArticle(popup.article.id, userId)
          console.log(`Disliked article ID: ${popup.article.id}`)

          // Update local state for the disliked article
          setArticles(
            articles.map((article) => {
              if (article.id === popup.article?.id) {
                return {
                  ...article,
                  userInteraction: {
                    ...(article.userInteraction || {}),
                    isDisliked: true,
                    // If it was liked before, remove the like when disliking
                    isLiked: false,
                  },
                } as Article
              }
              return article
            }),
          )
          break

        case "block":
          await userApi.blockArticle(popup.article.id, userId)
          console.log(`Blocked article ID: ${popup.article.id}`)

          // Remove the article from the list
          setArticles(articles.filter((a) => a.id !== popup.article?.id))
          break
      }
    } catch (err) {
      console.error(`Error performing ${popup.action} action:`, err)
      // You could add error handling UI here
    }

    // Close the popup
    setPopup({ show: false, article: null, action: null })
  }

  const cancelAction = () => {
    setPopup({ show: false, article: null, action: null })
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Your Dashboard</h1>
          <p>Articles based on your preferences: {userPreferences.join(", ")}</p>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="articles-section">
          <div className="section-header">
            <h2>Recommended Articles</h2>
            <div className="pagination-controls"></div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          )}

          {!error && articles.length === 0 ? (
            <div className="no-articles">
              <AlertCircle size={48} />
              <h3>No articles found</h3>
              <p>Try updating your preferences to see more content</p>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <div className="article-card" key={article.id} onClick={() => handleViewArticle(article)}>
                  <div className="article-image">
                    <img src={article.image || "/placeholder.svg"} alt={article.title} />
                    <div className="article-category">{article.category}</div>
                  </div>
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="article-tags">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="article-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="article-meta">
                      <span className="article-author">{article.author}</span>
                      <span className="article-date">{article.date}</span>
                    </div>
                    <div className="article-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`action-button like-button ${article.userInteraction?.isLiked ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDirectAction(article, "like")
                        }}
                      >
                        <Heart size={18} fill={article.userInteraction?.isLiked ? "currentColor" : "none"} />
                        <span>Like</span>
                      </button>
                      <button
                        className={`action-button dislike-button ${article.userInteraction?.isDisliked ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDirectAction(article, "dislike")
                        }}
                      >
                        <ThumbsDown size={18} fill={article.userInteraction?.isDisliked ? "currentColor" : "none"} />
                        <span>Dislike</span>
                      </button>
                      <button
                        className={`action-button block-button ${article.userInteraction?.isBlocked ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAction(article, "block") // Keep the popup for block action
                        }}
                      >
                        <X size={18} />
                        <span>Block</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {popup.show && popup.article && popup.action && (
        <ActionPopup article={popup.article} action={popup.action} onConfirm={confirmAction} onCancel={cancelAction} />
      )}
    </div>
  )
}