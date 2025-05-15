"use client"

import type React from "react"
import { motion } from "framer-motion"
import { BookOpen, Heart, Mail, GitlabIcon as GitHub, Twitter, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"
import "./Footer.scss"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  // Footer links
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Careers", path: "/careers" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
    resources: [
      { name: "Blog", path: "/blog" },
      { name: "Help Center", path: "/help" },
      { name: "Writing Guidelines", path: "/guidelines" },
      { name: "API Documentation", path: "/api-docs" },
      { name: "Community", path: "/community" },
    ],
    features: [
      { name: "Article Creation", path: "/create" },
      { name: "Content Management", path: "/manage" },
      { name: "Analytics", path: "/analytics" },
      { name: "Collaboration", path: "/collaboration" },
      { name: "Publishing", path: "/publishing" },
    ],
  }

  // Social media links
  const socialLinks = [
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
    { name: "GitHub", icon: GitHub, url: "https://github.com" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
    { name: "Email", icon: Mail, url: "mailto:contact@articlehub.com" },
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <BookOpen className="footer-logo-icon" />
              <span className="footer-brand-name">Article_Hub</span>
            </Link>
            <p className="footer-tagline">Your platform for creating and sharing exceptional articles</p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <ul className="footer-links-list">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Features</h3>
              <ul className="footer-links-list">
                {footerLinks.features.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Article_Hub. All rights reserved.</p>
          </div>
          <div className="footer-made-with">
            <p>
              Made with <Heart className="heart-icon" size={14} /> by the Article_Hub Team
            </p>
          </div>
        </div>
      </div>

      <div className="footer-decoration"></div>
    </footer>
  )
}

export default Footer
