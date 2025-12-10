import { Link } from 'react-router-dom';
import { sessions, games } from '../data/dummyData';
import './Discover.css';

function Discover() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="discover-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Find Your Next Game Night</h1>
          <p className="hero-subtitle">
            Connect with nearby players and join board game sessions in your area
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by game, location, or host..."
              className="search-input"
            />
            <button className="search-button">Search</button>
          </div>

          <div className="filters">
            <select className="filter-select">
              <option value="">All Games</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.image} {game.name}</option>
              ))}
            </select>

            <select className="filter-select">
              <option value="">Distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
            </select>

            <select className="filter-select">
              <option value="">Skill Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </select>

            <select className="filter-select">
              <option value="">When</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container sessions-section">
        <h2 className="section-title">Available Sessions</h2>

        <div className="sessions-grid">
          {sessions.map(session => (
            <Link
              key={session.id}
              to={`/session/${session.id}`}
              className="session-card"
            >
              <div className="session-header">
                <div className="game-info">
                  <span className="game-icon">{session.game.image}</span>
                  <div>
                    <h3 className="game-name">{session.game.name}</h3>
                    <p className="host-name">Hosted by {session.host.name}</p>
                  </div>
                </div>
                <span className={`status-badge ${session.status}`}>
                  {session.status === 'full' ? 'Full' : `${session.attendees.length}/${session.capacity}`}
                </span>
              </div>

              <p className="session-description">{session.description}</p>

              <div className="session-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{formatDate(session.startTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <span>{formatTime(session.startTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{session.location}</span>
                </div>
              </div>

              <div className="session-tags">
                <span className={`badge ${session.skillLevel === 'beginner' ? 'success' : session.skillLevel === 'intermediate' ? 'warning' : 'primary'}`}>
                  {session.skillLevel}
                </span>
                {session.materialsProvided && (
                  <span className="badge">Materials Provided</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
