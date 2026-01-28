import { Link, useLocation } from 'react-router-dom';
import api from '../api/userApi';

function TopNav({ currentUser, setCurrentUser }) {
  const handleLogout = async () => {
    await api.post('/logout'); // or your logout function
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const location = useLocation();

  const linkStyle = (path) => ({
    marginRight: '16px',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    textDecoration: 'none',
    color: location.pathname === path ? '#007bff' : '#333',
  });

  if (!currentUser) return null;

  return (
    <nav style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #ddd' }}>
      {/* Dynamic link to the logged-in user's own profile */}
      <Link to={`/profile/${currentUser?.id}`} style={linkStyle(`/profile/${currentUser.id}`)}>
        My Profile
      </Link>

      <Link to="/" style={linkStyle('/')}>
        Goals
      </Link>

      <Link to="/leaderboard" style={linkStyle('/leaderboard')}>
        Leaderboard
      </Link>

      <Link to="/achievements" style={linkStyle('/achievements')}>
        Achievements
      </Link>

      <Link to="/archived" style={linkStyle('/archived')}>
        Archive
      </Link>
      <Link to="/test" style={linkStyle('/test')}>
        Test View
      </Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
        Logout
      </button>
    </nav>
  );
}

export default TopNav;
