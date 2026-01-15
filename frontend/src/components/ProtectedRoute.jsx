import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
