import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import Archived from './pages/Archived';
import Achievements from './pages/Achievements';

import TopNav from './components/TopNav';
import ProtectedRoute from './components/ProtectedRoute';
import UserHome from './pages/UserHome';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { logout } from './api/userApi.js';

// src/api/goalApi.js
import axios from 'axios';

function AppContent({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/users/me', { withCredentials: true });
        setCurrentUser(res.data);
      } catch (err) {
        console.log('No session user found', err);
        setCurrentUser(null);
      }
    };

    fetchSessionUser();
  }, []);

  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/complete-profile" element={<CompleteProfile currentUser={currentUser} />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Home currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <UserHome currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archived"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Archived />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <AppContent currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </BrowserRouter>
  );
}

export default App;
