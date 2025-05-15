
import React from 'react';
import { type RouteObject } from "react-router-dom";
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ArticleCreationPage from '../pages/ArticleCreation';
import AppLayout from '../layout/Applayout';

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
      { 
        path: "create", 
        element: React.createElement(ArticleCreationPage)
      }
    ]
  }
];