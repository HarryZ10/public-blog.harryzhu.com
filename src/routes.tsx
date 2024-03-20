import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import { Logout } from './api/UsersAPI';


/**
 * Manages routing on the client side to different pages
 */
const RoutesHandler = () => {
  let value = process.env.REACT_APP_BASENAME || "/";

  return (
    <Router basename={value}>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/feed" element={<FeedPage isProfileMode={false}/>} />
        <Route path="/profile" element={<FeedPage isProfileMode={true}/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/logout" element={<Logout /> } />
      </Routes>
    </Router>
  );
};

export default RoutesHandler;
