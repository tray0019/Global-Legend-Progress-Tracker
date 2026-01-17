import React from 'react';
import { oauthRegister } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

function Login({ setCurrentUser }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await oauthRegister('tray0019@gmail.com', 'GOOGLE', 'local-test-123');
      setCurrentUser(user);

      if (!user.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/'); // home page
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h1>Login / Sign-up</h1>
      <button onClick={handleGoogleLogin}>Continue with Google</button>
      <button onClick={handleGoogleLogin}>Sign up with Google</button>
    </div>
  );
}

export default Login;
