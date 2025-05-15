import React from 'react';
import { type RouteObject } from "react-router-dom";
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ArticleCreationPage from '../pages/ArticleCreation';

export const routes: RouteObject[] = [
  // Main routes
  { 
    path: "/", 
    element: React.createElement(HomePage) 
  },
  { 
    path: "/login", 
    element: React.createElement(Login) 
  },
  { 
    path: "/register", 
    element: React.createElement(Register) 
  },
  { 
    path: "/create", 
    element: React.createElement(ArticleCreationPage) 
  }
];