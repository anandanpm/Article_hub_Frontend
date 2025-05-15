
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "./HomePage.scss"
import { ArrowRight, BookOpen, ThumbsUp, Award, Bookmark, Feather, TrendingUp, Users } from "lucide-react"

const quotes = [
  "Knowledge is power. Information is liberating.",
  "The more that you read, the more things you will know.",
  "Reading is to the mind what exercise is to the body.",
  "A reader lives a thousand lives before he dies.",
  "Today a reader, tomorrow a leader.",
]

const categories = [
  { name: "Technology", icon: <Feather size={20} />, color: "#1e3a5f" },
  { name: "Science", icon: <Award size={20} />, color: "#1e3a5f" },
  { name: "Arts", icon: <Bookmark size={20} />, color: "#1e3a5f" },
  { name: "Business", icon: <TrendingUp size={20} />, color: "#1e3a5f" },
]

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [quote, setQuote] = useState("")
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    // Set a random quote on load
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])

    // Change quote every 10 seconds
    const quoteInterval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, 10000)

    // Rotate through features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)

    return () => {
      clearInterval(quoteInterval)
      clearInterval(featureInterval)
    }
  }, [])

  const handleLogin = () => {
    navigate("/login")
  }

  const handleRegister = () => {
    navigate("/register")
  }

  const handleExplore = () => {
    navigate("/login")
  }

  return (
    <div className="home-container">
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo-container">
          <div className="logo">
            <BookOpen className="logo-icon" />
            <motion.span
              className="brand-name"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Article_Hub
            </motion.span>
          </div>
        </div>
      </motion.header>

      <motion.div
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="hero-section">
          <div className="text-container">
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Share wisdom, find inspiration, grow together
            </motion.p>

            <motion.h1
              className="title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Article_Hub
            </motion.h1>

            <motion.div
              className="quote-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="quote">"{quote}"</p>
            </motion.div>

            <motion.div
              className="description-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <p className="description">
                Your platform to discover, create, and share articles across various categories. Join our community of
                writers and readers today!
              </p>
            </motion.div>

            <motion.div
              className="arrow-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <ArrowRight className="arrow-icon" onClick={handleLogin} />
            </motion.div>
          </div>

          <motion.div
            className="buttons-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <button className="btn login-btn" onClick={handleLogin}>
              Login
            </button>

            <button className="btn register-btn" onClick={handleRegister}>
              Register
            </button>
          </motion.div>
        </div>

        <motion.div
          className="features-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <h2 className="section-title">Why Join Article_Hub?</h2>

          <div className="features-container">
            <motion.div
              className={`feature-card ${activeFeature === 0 ? "active" : ""}`}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="feature-icon">
                <Feather size={32} />
              </div>
              <h3>Write & Share</h3>
              <p>
                Create compelling articles on topics you're passionate about and share them with our growing community.
              </p>
            </motion.div>

            <motion.div
              className={`feature-card ${activeFeature === 1 ? "active" : ""}`}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="feature-icon">
                <ThumbsUp size={32} />
              </div>
              <h3>Engage & Connect</h3>
              <p>
                Like, comment, and interact with content from writers around the world. Build your network of
                like-minded individuals.
              </p>
            </motion.div>

            <motion.div
              className={`feature-card ${activeFeature === 2 ? "active" : ""}`}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Grow Your Audience</h3>
              <p>
                Build a following as readers subscribe to your content. Gain recognition for your expertise and
                insights.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="categories-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          <h2 className="section-title">Explore Categories</h2>

          <div className="categories-container">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="category-card"
                whileHover={{ scale: 1.05 }}
                style={{ borderColor: category.color }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
              </motion.div>
            ))}
          </div>

          <motion.button className="explore-btn" onClick={handleExplore} whileHover={{ scale: 1.05 }}>
            Explore All Categories
          </motion.button>
        </motion.div>

        <motion.div
          className="cta-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <div className="cta-content">
            <h2>Ready to share your story?</h2>
            <p>Join thousands of writers and readers on Article_Hub today.</p>
            <button className="btn register-btn-large" onClick={handleRegister}>
              Get Started Now
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.footer
        className="contact-info"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        <p className="email">article_hub.com</p>
        <p className="copyright">© {new Date().getFullYear()} Article_Hub. All rights reserved.</p>
      </motion.footer>
    </div>
  )
}

export default HomePage
