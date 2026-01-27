import { Link, useLocation } from 'react-router-dom';

function TopNav() {
  const location = useLocation();

  const linkStyle = (path) => ({
    marginRight: '16px',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
  });

  return (
    <div style={{ marginBottom: '20px' }}>
      <Link to="/" style={linkStyle('/')}>
        Goals
      </Link>
      <Link to="/achievements" style={linkStyle('/achievements')}>
        Achievements
      </Link>
      <Link to="/archived" style={linkStyle('/archived')}>
        Archive
      </Link>
      <Link to="/home" style={linkStyle('/home')}>
        UserHome
      </Link>
      <Link to="/Leaderboard" style={linkStyle('/Leaderboard')}>
        Leaderboard
      </Link>
    </div>
  );
}

export default TopNav;
