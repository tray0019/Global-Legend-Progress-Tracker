import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import UserArchived from './pages/UserArchived';
import Archived from './pages/UserArchived';
import UserAchievements from './pages/UserAchievements';
import PublicProfile from './pages/PublicProfile';

import TopNav from './components/TopNav';
import GoalTrackerApp from './components/test';

import ProtectedRoute from './components/ProtectedRoute';
import UserHome from './pages/UserHome';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { logout } from './api/userApi.js';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Leaderboard from './pages/Leaderboard'; // Adjust path if it's in components

function AppContent({ currentUser, setCurrentUser, sessionReady, setSessionReady }) {
  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const res = await axios.get('http://localhost:8080/users/me', { withCredentials: true });
        setCurrentUser(res.data);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setSessionReady(true);
      }
    };
    bootstrapSession();
  }, [setCurrentUser, setSessionReady]);

  if (!sessionReady) return <p>Initializing...</p>;

  return (
    <>
      <TopNav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Only accessible if logged in but profile incomplete */}
        <Route
          path="/complete-profile"
          element={
            currentUser && !currentUser.profileCompleted ? (
              <CompleteProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Fully Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Home currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route path="/profile/:userId" element={<PublicProfile />} />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Leaderboard />
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
              <UserAchievements currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archived"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <UserArchived currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/test"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <GoalTrackerApp currentUser={currentUser} />
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
