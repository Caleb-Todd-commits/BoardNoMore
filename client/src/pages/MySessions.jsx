import { Link } from 'react-router-dom';
import { sessions, currentUser } from '../data/dummyData';
import './MySessions.css';

function MySessions() {
  const hostedSessions = sessions.filter(s => s.hostId === currentUser.id);
  const attendingSessions = sessions.filter(
    s => s.attendees.includes(currentUser.id) && s.hostId !== currentUser.id
  );

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
    <div className="my-sessions-page">
      <div className="container">
        <div className="page-header">
          <h1>My Sessions</h1>
          <Link to="/create" className="create-session-link">
            + Create New Session
          </Link>
        </div>

        <div className="sessions-tabs">
          <button className="tab-button active">All Sessions</button>
          <button className="tab-button">Hosting ({hostedSessions.length})</button>
          <button className="tab-button">Attending ({attendingSessions.length})</button>
        </div>

        <div className="sessions-content">
          <section className="sessions-group">
            <h2 className="group-title">Hosting</h2>
            {hostedSessions.length > 0 ? (
              <div className="sessions-list">
                {hostedSessions.map(session => (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    className="my-session-card"
                  >
                    <div className="session-card-header">
                      <span className="session-game-icon">{session.game.image}</span>
                      <div className="session-card-info">
                        <h3>{session.game.name}</h3>
                        <p className="session-location-text">
                          📍 {session.location}
                        </p>
                      </div>
                      <span className={`session-status-badge ${session.status}`}>
                        {session.status === 'full' ? 'Full' : 'Open'}
                      </span>
                    </div>

                    <div className="session-card-body">
                      <div className="session-datetime">
                        <span>📅 {formatDate(session.startTime)}</span>
                        <span>•</span>
                        <span>🕐 {formatTime(session.startTime)}</span>
                      </div>

                      <div className="session-attendees-count">
                        👥 {session.attendees.length}/{session.capacity} attendees
                      </div>
                    </div>

                    <div className="session-card-actions">
                      <button className="session-action-btn secondary">
                        Edit
                      </button>
                      <button className="session-action-btn secondary">
                        Manage
                      </button>
                      <button className="session-action-btn danger">
                        Cancel
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎲</span>
                <p>You're not hosting any sessions yet</p>
                <Link to="/create" className="empty-action">
                  Create Your First Session
                </Link>
              </div>
            )}
          </section>

          <section className="sessions-group">
            <h2 className="group-title">Attending</h2>
            {attendingSessions.length > 0 ? (
              <div className="sessions-list">
                {attendingSessions.map(session => (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    className="my-session-card"
                  >
                    <div className="session-card-header">
                      <span className="session-game-icon">{session.game.image}</span>
                      <div className="session-card-info">
                        <h3>{session.game.name}</h3>
                        <p className="session-location-text">
                          Hosted by {session.host.name}
                        </p>
                      </div>
                      <span className={`session-status-badge ${session.status}`}>
                        Joined
                      </span>
                    </div>

                    <div className="session-card-body">
                      <div className="session-datetime">
                        <span>📅 {formatDate(session.startTime)}</span>
                        <span>•</span>
                        <span>🕐 {formatTime(session.startTime)}</span>
                      </div>

                      <p className="session-location-text">
                        📍 {session.location}
                      </p>
                    </div>

                    <div className="session-card-actions">
                      <button className="session-action-btn secondary">
                        View Details
                      </button>
                      <button className="session-action-btn danger">
                        Leave Session
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>You haven't joined any sessions yet</p>
                <Link to="/" className="empty-action">
                  Discover Sessions
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default MySessions;
