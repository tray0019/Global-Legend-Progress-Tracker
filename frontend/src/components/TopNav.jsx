import { Link, useLocation } from 'react-router-dom';
import api from '../api/userApi';

function TopNav({ currentUser, setCurrentUser }) {
  const location = useLocation();

  const handleLogout = async () => {
    await api.post('/logout');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const linkStyle = (path) => ({
    position: 'relative',
    marginRight: 24,
    paddingBottom: 4,
    fontWeight: location.pathname === path ? 600 : 500,
    color: location.pathname === path ? '#007bff' : '#555',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  const linkHoverStyle = {
    cursor: 'pointer',
    color: '#007bff',
  };

  if (!currentUser) return null;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link
          to={`/profile/${currentUser?.id}`}
          style={linkStyle(`/profile/${currentUser.id}`)}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color =
              location.pathname === `/profile/${currentUser.id}` ? '#007bff' : '#555')
          }
        >
          My Profile
        </Link>

        <Link
          to="/"
          style={linkStyle('/')}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color = location.pathname === '/' ? '#007bff' : '#555')
          }
        >
          Goals
        </Link>

        <Link
          to="/leaderboard"
          style={linkStyle('/leaderboard')}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color =
              location.pathname === '/leaderboard' ? '#007bff' : '#555')
          }
        >
          Leaderboard
        </Link>

        <Link
          to="/achievements"
          style={linkStyle('/achievements')}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color =
              location.pathname === '/achievements' ? '#007bff' : '#555')
          }
        >
          Achievements
        </Link>

        <Link
          to="/archived"
          style={linkStyle('/archived')}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color = location.pathname === '/archived' ? '#007bff' : '#555')
          }
        >
          Archive
        </Link>

        <Link
          to="/test"
          style={linkStyle('/test')}
          onMouseOver={(e) => (e.currentTarget.style.color = '#007bff')}
          onMouseOut={(e) =>
            (e.currentTarget.style.color = location.pathname === '/test' ? '#007bff' : '#555')
          }
        >
          Test
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          padding: '6px 16px',
          borderRadius: 8,
          border: 'none',
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#e04444')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#ff4d4f')}
      >
        Logout
      </button>
    </nav>
  );
}

export default TopNav;
