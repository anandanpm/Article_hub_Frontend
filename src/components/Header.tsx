

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Menu, X, Home, PenTool, List, Edit, User, LogOut } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store" 
import { logout, logoutUser } from "../redux/userSlice" 
import "./Header.scss"

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const location = useLocation()
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Create Article", path: "/create", icon: PenTool },
    { name: "Article Library", path: "/articles", icon: List },
    { name: "My Drafts", path: "/drafts", icon: Edit },
    { name: "Profile", path: "/profile", icon: User },
  ]

  // Check if current path matches nav item path
  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    dispatch(logoutUser())
    navigate("/")
    
    // Close mobile menu if open
    closeMobileMenu()
  }

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.header
      className={`header ${isScrolled ? "scrolled" : ""}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="header-container">
        <Link to="/" className="logo-container">
          <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <BookOpen className="logo-icon" />
            <motion.span
              className="brand-name"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Article_Hub
            </motion.span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <motion.li key={item.name} custom={index} initial="hidden" animate="visible" variants={navItemVariants}>
                <Link to={item.path} className={`nav-link ${isActive(item.path) ? "active" : ""}`}>
                  <item.icon className="nav-icon" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="logout-icon" />
            <span>Logout</span>
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </motion.button>

        {/* Mobile Navigation */}
        <motion.nav
          className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
          initial={{ opacity: 0, x: "100%" }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            x: isMobileMenuOpen ? 0 : "100%",
          }}
          transition={{ duration: 0.3 }}
        >
          <ul className="mobile-nav-list">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : 20,
                }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <motion.button
            className="mobile-logout-button"
            onClick={handleLogout}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isMobileMenuOpen ? 1 : 0,
              x: isMobileMenuOpen ? 0 : 20,
            }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <LogOut className="logout-icon" />
            <span>Logout</span>
          </motion.button>
        </motion.nav>
      </div>
    </motion.header>
  )
}

export default Header
