import React, { useState } from 'react';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import Archived from './pages/Archived';
import Achievements from './pages/Achievements';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import RankTest from './components/RankTest';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="app-container">
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
      </div>
    </BrowserRouter>
  );
}

export default App;
