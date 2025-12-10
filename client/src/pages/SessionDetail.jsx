import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSession, joinSession, leaveSession } from '../services/sessions';
import { getComments, createComment } from '../services/comments';
import { useAuth } from '../context/AuthContext';
import './SessionDetail.css';

function SessionDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionData, commentsData] = await Promise.all([
          getSession(id),
          getComments(id)
        ]);
        setSession(sessionData);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to join sessions');
      return;
    }
    try {
      await joinSession(id);
      const updatedSession = await getSession(id);
      setSession(updatedSession);
    } catch (err) {
      alert('Error joining session: ' + err.message);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveSession(id);
      const updatedSession = await getSession(id);
      setSession(updatedSession);
    } catch (err) {
      alert('Error leaving session: ' + err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      setSubmitting(true);
      await createComment(id, commentText);
      setCommentText('');
      const updatedComments = await getComments(id);
      setComments(updatedComments);
    } catch (err) {
      alert('Error posting comment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container" style={{ padding: '3rem' }}>
        <h2>Session not found</h2>
        <p style={{ color: '#c33' }}>{error}</p>
        <Link to="/">Back to Discover</Link>
      </div>
    );
  }

  const sessionComments = comments;
  const attendeeUsers = session.attendees || [];

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

  const isUserAttending = attendeeUsers.some(a => a.id === user?.id);

  return (
    <div className="session-detail-page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Discover</Link>

        <div className="session-content">
          <div className="main-column">
            <div className="session-hero card">
              <div className="game-header">
                <span className="game-icon-large">{session.game?.image || '🎲'}</span>
                <div>
                  <h1>{session.game?.name || 'Unknown Game'}</h1>
                  <div className="game-meta">
                    <span>{session.game?.min_players || 2}-{session.game?.max_players || 4} players</span>
                    <span>•</span>
                    <span className="tags">
                      {session.game?.tags?.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      )) || <span className="tag">#boardgame</span>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="session-status-bar">
                <span className={`status-badge ${session.status}`}>
                  {session.status === 'full'
                    ? 'Session Full'
                    : `${attendeeUsers.length}/${session.capacity} Spots Filled`
                  }
                </span>
                <span className={`badge ${session.skill_level === 'beginner' ? 'success' : session.skill_level === 'intermediate' ? 'warning' : 'primary'}`}>
                  {session.skill_level}
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
                  <span className="detail-value">{formatDate(session.start_time)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🕐 Time</span>
                  <span className="detail-value">
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
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
                    {session.materials_provided ? 'All materials provided' : 'Bring your own'}
                  </span>
                </div>
              </div>
            </div>

            <div className="session-section card">
              <h2>Attendees ({attendeeUsers.length}/{session.capacity})</h2>
              <div className="attendees-list">
                {attendeeUsers.map(user => (
                  <div key={user.id} className="attendee-card">
                    <span className="attendee-avatar">{user.avatar || '👤'}</span>
                    <div className="attendee-info">
                      <div className="attendee-name">
                        {user.name}
                        {user.id === session.host_id && (
                          <span className="host-badge">Host</span>
                        )}
                      </div>
                      <div className="attendee-stats">
                        <span>⭐ {user.rating || 0}</span>
                        <span>•</span>
                        <span>{user.games_played || 0} games</span>
                        <span>•</span>
                        <span>{user.location || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="session-section card">
              <h2>Comments ({sessionComments.length})</h2>

              {isAuthenticated && (
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Ask a question or leave a comment..."
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" disabled={submitting || !commentText.trim()}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}

              <div className="comments-list">
                {sessionComments.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  sessionComments.map(comment => (
                    <div key={comment.id} className="comment">
                      <span className="comment-avatar">{comment.user?.avatar || '👤'}</span>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user?.name || 'Anonymous'}</span>
                          <span className="comment-time">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="sidebar-column">
            <div className="card sidebar-card">
              <h3>Host</h3>
              <div className="host-profile">
                <span className="host-avatar-large">{session.host?.avatar || '👤'}</span>
                <h4>{session.host?.name || 'Unknown'}</h4>
                <div className="host-stats">
                  <div className="stat">
                    <span className="stat-value">⭐ {session.host?.rating || 0}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{session.host?.games_played || 0}</span>
                    <span className="stat-label">Games</span>
                  </div>
                </div>
                <p className="host-bio">{session.host?.bio || 'No bio available'}</p>
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
              ) : isUserAttending ? (
                <button className="join-button secondary" onClick={handleLeave}>
                  Leave Session
                </button>
              ) : (
                <button className="join-button" onClick={handleJoin}>
                  Join This Session
                </button>
              )}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
                {session.capacity - attendeeUsers.length} spot{session.capacity - attendeeUsers.length !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
