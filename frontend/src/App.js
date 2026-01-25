import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import UserArchived from './pages/UserArchived';
import Archived from './pages/UserArchived';
import UserAchievements from './pages/UserAchievements';

import TopNav from './components/TopNav';
import ProtectedRoute from './components/ProtectedRoute';
import UserHome from './pages/UserHome';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { logout } from './api/userApi.js';
import axios from 'axios';

function AppContent({ currentUser, setCurrentUser, sessionReady, setSessionReady }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // 🔒 SESSION BOOTSTRAP (runs ONCE)
  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        // 1️⃣ recreate session after backend restart (DEV ONLY)
        await axios.post('http://localhost:8080/auth/dev-login', {}, { withCredentials: true });

        // 2️⃣ confirm authenticated session
        const res = await axios.get('http://localhost:8080/users/me', { withCredentials: true });

        setCurrentUser(res.data);
        console.log('Session restored:', res.data.email);
      } catch (err) {
        console.log('No session user found');
        setCurrentUser(null);
      } finally {
        // 🔓 allow app to render
        setSessionReady(true);
      }
    };

    bootstrapSession();
  }, []);

  // ⛔ HARD BLOCK until session is ready
  if (!sessionReady) {
    return <p>Initializing session...</p>;
  }

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
              <UserAchievements />
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
  const [sessionReady, setSessionReady] = useState(false);

  return (
    <BrowserRouter>
      <AppContent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        sessionReady={sessionReady}
        setSessionReady={setSessionReady}
      />
    </BrowserRouter>
  );
}

export default App;
