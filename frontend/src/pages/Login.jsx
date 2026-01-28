function Login() {
  const handleGoogleLogin = () => {
    // Redirect the browser directly to the Spring Boot OAuth endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-container">
      <h1>Login / Sign-up</h1>
      <p>Join the community and track your goals!</p>

      <button onClick={handleGoogleLogin} className="google-btn">
        Continue with Google
      </button>

      <button onClick={handleGoogleLogin} className="google-btn-secondary">
        Sign up with Google
      </button>
    </div>
  );
}
export default Login;
