import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isAuthenticated = false }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🎲</span>
            <span className="brand-name">BoardNoMore</span>
          </Link>

          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Discover
            </Link>
            <Link
              to="/games"
              className={`nav-link ${isActive('/games') ? 'active' : ''}`}
            >
              Games
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-games"
                  className={`nav-link ${isActive('/my-games') ? 'active' : ''}`}
                >
                  My Games
                </Link>
                <Link
                  to="/create"
                  className="nav-link create-button"
                >
                  + Create Game
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="nav-link auth-button"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
