import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ currentUser, children }) => {
  // 1. If not logged in, go to Login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but profile is incomplete, force them to complete it
  if (!currentUser.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  // 3. Otherwise, let them in
  return children;
};

export default ProtectedRoute;
