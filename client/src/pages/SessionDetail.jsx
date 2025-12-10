import { useParams, Link } from 'react-router-dom';
import { sessions, users, comments } from '../data/dummyData';
import './SessionDetail.css';

function SessionDetail() {
  const { id } = useParams();
  const session = sessions.find(s => s.id === parseInt(id));

  if (!session) {
    return (
      <div className="container" style={{ padding: '3rem' }}>
        <h2>Session not found</h2>
        <Link to="/">Back to Discover</Link>
      </div>
    );
  }

  const sessionComments = comments.filter(c => c.sessionId === session.id);
  const attendeeUsers = users.filter(u => session.attendees.includes(u.id));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
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
    <div className="session-detail-page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Discover</Link>

        <div className="session-content">
          <div className="main-column">
            <div className="session-hero card">
              <div className="game-header">
                <span className="game-icon-large">{session.game.image}</span>
                <div>
                  <h1>{session.game.name}</h1>
                  <div className="game-meta">
                    <span>{session.game.minPlayers}-{session.game.maxPlayers} players</span>
                    <span>•</span>
                    <span className="tags">
                      {session.game.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="session-status-bar">
                <span className={`status-badge ${session.status}`}>
                  {session.status === 'full'
                    ? 'Session Full'
                    : `${session.attendees.length}/${session.capacity} Spots Filled`
                  }
                </span>
                <span className={`badge ${session.skillLevel === 'beginner' ? 'success' : session.skillLevel === 'intermediate' ? 'warning' : 'primary'}`}>
                  {session.skillLevel}
                </span>
              </div>
            </div>

            <div className="session-section card">
              <h2>About This Session</h2>
              <p className="session-description-full">{session.description}</p>
            </div>

            <div className="session-section card">
              <h2>Session Details</h2>
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">📅 Date</span>
                  <span className="detail-value">{formatDate(session.startTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🕐 Time</span>
                  <span className="detail-value">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📍 Location</span>
                  <span className="detail-value">
                    {session.location}
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>{session.address}</small>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🎲 Materials</span>
                  <span className="detail-value">
                    {session.materialsProvided ? 'All materials provided' : 'Bring your own'}
                  </span>
                </div>
              </div>
            </div>

            <div className="session-section card">
              <h2>Attendees ({attendeeUsers.length}/{session.capacity})</h2>
              <div className="attendees-list">
                {attendeeUsers.map(user => (
                  <div key={user.id} className="attendee-card">
                    <span className="attendee-avatar">{user.avatar}</span>
                    <div className="attendee-info">
                      <div className="attendee-name">
                        {user.name}
                        {user.id === session.hostId && (
                          <span className="host-badge">Host</span>
                        )}
                      </div>
                      <div className="attendee-stats">
                        <span>⭐ {user.rating}</span>
                        <span>•</span>
                        <span>{user.gamesPlayed} games</span>
                        <span>•</span>
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="session-section card">
              <h2>Comments ({sessionComments.length})</h2>

              <div className="comment-form">
                <textarea
                  placeholder="Ask a question or leave a comment..."
                  rows="3"
                />
                <button>Post Comment</button>
              </div>

              <div className="comments-list">
                {sessionComments.map(comment => (
                  <div key={comment.id} className="comment">
                    <span className="comment-avatar">{comment.user.avatar}</span>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user.name}</span>
                        <span className="comment-time">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-column">
            <div className="card sidebar-card">
              <h3>Host</h3>
              <div className="host-profile">
                <span className="host-avatar-large">{session.host.avatar}</span>
                <h4>{session.host.name}</h4>
                <div className="host-stats">
                  <div className="stat">
                    <span className="stat-value">⭐ {session.host.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{session.host.gamesPlayed}</span>
                    <span className="stat-label">Games</span>
                  </div>
                </div>
                <p className="host-bio">{session.host.bio}</p>
                <button className="secondary" style={{ width: '100%' }}>
                  View Profile
                </button>
              </div>
            </div>

            <div className="card sidebar-card">
              {session.status === 'full' ? (
                <button className="join-button" disabled>
                  Session Full
                </button>
              ) : (
                <button className="join-button">
                  Join This Session
                </button>
              )}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
                {session.capacity - session.attendees.length} spot{session.capacity - session.attendees.length !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
