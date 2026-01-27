import React from 'react';
import { oauthRegister } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

function Login() {
  const handleGoogleLogin = () => {
    // Redirect the browser directly to the Spring Boot OAuth endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div>
      <h1>Login / Sign-up</h1>
      {/* Both buttons now trigger the actual Google flow */}
      <button onClick={handleGoogleLogin}>Continue with Google</button>
      <button onClick={handleGoogleLogin}>Sign up with Google</button>
    </div>
  );
}
export default Login;
