import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/profiles';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      alert('Error signing out: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '16px', color: '#c33', backgroundColor: '#fee', padding: '20px', borderRadius: '8px' }}>
            Error loading profile: {error || 'Profile not found'}
          </div>
        </div>
      </div>
    );
  }

  const favoriteGamesList = profile.favorite_games || [];

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-hero">
            <span className="profile-avatar-large">{profile.avatar || '👤'}</span>
            <div className="profile-info">
              <h1>{profile.name}</h1>
              <p className="profile-location">📍 {profile.location || 'Location not set'}</p>
              <div className="profile-stats-bar">
                <div className="stat-item">
                  <span className="stat-value">⭐ {profile.rating || 0}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.games_played || 0}</span>
                  <span className="stat-label">Games Played</span>
                </div>
              </div>
            </div>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-main">
            <div className="card profile-section">
              <h2>About Me</h2>
              <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
            </div>

            <div className="card profile-section">
              <h2>Favorite Games</h2>
              {favoriteGamesList.length > 0 ? (
                <div className="favorite-games-grid">
                  {favoriteGamesList.map(game => (
                    <div key={game.id} className="favorite-game-card">
                      <span className="game-icon-small">{game.image || '🎲'}</span>
                      <div>
                        <div className="game-name-small">{game.name}</div>
                        <div className="game-players-small">
                          {game.min_players}-{game.max_players} players
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>No favorite games yet</p>
              )}
            </div>

            <div className="card profile-section">
              <h2>Preferences</h2>
              <div className="preferences-grid">
                <div className="preference-item">
                  <span className="preference-label">Skill Level</span>
                  <span className="preference-value badge primary">
                    {profile.skill_level || 'Not set'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Preferred Player Count</span>
                  <span className="preference-value">
                    {profile.preferred_player_count || 'Not set'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Willing to Host</span>
                  <span className="preference-value">
                    {profile.willing_to_host ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Max Travel Distance</span>
                  <span className="preference-value">
                    {profile.max_travel_distance || 10} miles
                  </span>
                </div>
              </div>
            </div>

            <div className="card profile-section">
              <h2>Availability</h2>
              <p className="section-description">
                When you're typically available to play
              </p>
              {profile.availability && profile.availability.length > 0 ? (
                <div className="availability-grid">
                  {Object.entries(
                    profile.availability.reduce((acc, avail) => {
                      if (!acc[avail.day_of_week]) acc[avail.day_of_week] = [];
                      acc[avail.day_of_week].push(avail.time_slot);
                      return acc;
                    }, {})
                  ).map(([day, times]) => (
                    <div key={day} className="availability-day">
                      <span className="day-name">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                      <div className="time-slots">
                        {times.map(time => (
                          <span key={time} className="time-slot badge success">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>No availability set</p>
              )}
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-button" onClick={() => navigate('/create')}>
                  <span>🎲</span>
                  Create Session
                </button>
                <button className="action-button secondary" onClick={() => navigate('/my-sessions')}>
                  <span>📅</span>
                  View My Sessions
                </button>
                <button className="action-button secondary" onClick={() => navigate('/games')}>
                  <span>🔍</span>
                  Browse Games
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Account Settings</h3>
              <div className="settings-list">
                <button className="setting-item">
                  <span>🔔</span>
                  Notifications
                </button>
                <button className="setting-item">
                  <span>🔒</span>
                  Privacy
                </button>
                <button className="setting-item">
                  <span>🛡️</span>
                  Safety & Blocking
                </button>
                <button className="setting-item danger" onClick={handleSignOut}>
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
