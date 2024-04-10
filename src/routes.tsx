import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';

import { PostsProvider } from './contexts/PostsContext';
import { AuthProvider } from './contexts/AuthContext';
import SearchPage from './pages/SearchPage';

/**
 * Manages routing on the client side to different pages
 */
const RoutesHandler = () => {
  let value = process.env.REACT_APP_BASENAME || "/";

  return (
    <Router basename={value}>
      <AuthProvider>
        <PostsProvider>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/blog" element={<FeedPage isProfileMode={false}/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/profile/:userId" element={<FeedPage isProfileMode={true}/>}/>
            <Route path="/profile" element={<FeedPage isProfileMode={true}/>} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </PostsProvider>
      </AuthProvider>
    </Router>
  );
};

export default RoutesHandler;
