import React from 'react';
import { type RouteObject } from "react-router-dom";
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ArticleCreationPage from '../pages/ArticleCreation';
import AppLayout from '../layout/Applayout';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from "./Protectroute"
import ArticleDetail from '../pages/ArticleDetail';
import MyArticle from '../pages/MyArticle';

export const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      // Public pages
      { 
        index: true, 
        element: React.createElement(HomePage)
      },
      { 
        path: "login", 
        element: React.createElement(Login)
      },
      { 
        path: "register", 
        element: React.createElement(Register)
      },
      
      // Protected routes
      {
        element: React.createElement(ProtectedRoute),
        children: [
          { 
            path: "create", 
            element: React.createElement(ArticleCreationPage)
          },
          {
            path: "dashboard",
            element: React.createElement(Dashboard)
          },
          {
            path:"article/:articleid",
            element:React.createElement(ArticleDetail)
          },
          {
            path:'articles',
            element:React.createElement(MyArticle)
          }
        ]
      }
    ]
  }
];