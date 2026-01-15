import React from 'react';

function Login({ setCurrentUser }) {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/users/oauth-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'tray0019@gmail.com',
          provider: 'GOOGLE',
          providerUserId: 'local-test-123',
        }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      console.log('Logged in user:', data);

      // Update the app state
      setCurrentUser(data);

      // redirect if profile not completed
      if (!data.profileCompleted) {
        window.location.href = '/complete-profile';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login / Sign-up</h1>
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
}

export default Login;
