import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import Archived from './pages/Archived';
import Achievements from './pages/Achievements';

import TopNav from './components/TopNav';
import RankTest from './components/RankTest';
import ProtectedRoute from './components/ProtectedRoute';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AppContent({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (!currentUser.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/'); // home
      }
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

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
              <Home currentUser={currentUser} />
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
