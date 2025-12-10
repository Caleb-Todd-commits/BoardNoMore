import { currentUser, games } from '../data/dummyData';
import './Profile.css';

function Profile() {
  const favoriteGamesList = currentUser.preferences.favoriteGames.map(
    id => games.find(g => g.id === id)
  );

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-hero">
            <span className="profile-avatar-large">{currentUser.avatar}</span>
            <div className="profile-info">
              <h1>{currentUser.name}</h1>
              <p className="profile-location">📍 {currentUser.location}</p>
              <div className="profile-stats-bar">
                <div className="stat-item">
                  <span className="stat-value">⭐ {currentUser.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{currentUser.gamesPlayed}</span>
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
              <p className="profile-bio">{currentUser.bio}</p>
            </div>

            <div className="card profile-section">
              <h2>Favorite Games</h2>
              <div className="favorite-games-grid">
                {favoriteGamesList.map(game => (
                  <div key={game.id} className="favorite-game-card">
                    <span className="game-icon-small">{game.image}</span>
                    <div>
                      <div className="game-name-small">{game.name}</div>
                      <div className="game-players-small">
                        {game.minPlayers}-{game.maxPlayers} players
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card profile-section">
              <h2>Preferences</h2>
              <div className="preferences-grid">
                <div className="preference-item">
                  <span className="preference-label">Skill Level</span>
                  <span className="preference-value badge primary">
                    {currentUser.preferences.skillLevel}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Preferred Player Count</span>
                  <span className="preference-value">
                    {currentUser.preferences.preferredPlayerCount} players
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Willing to Host</span>
                  <span className="preference-value">
                    {currentUser.preferences.willingToHost ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Max Travel Distance</span>
                  <span className="preference-value">
                    {currentUser.preferences.maxTravelDistance} miles
                  </span>
                </div>
              </div>
            </div>

            <div className="card profile-section">
              <h2>Availability</h2>
              <p className="section-description">
                When you're typically available to play
              </p>
              <div className="availability-grid">
                {currentUser.availability.map(avail => (
                  <div key={avail.day} className="availability-day">
                    <span className="day-name">
                      {avail.day.charAt(0).toUpperCase() + avail.day.slice(1)}
                    </span>
                    <div className="time-slots">
                      {avail.times.map(time => (
                        <span key={time} className="time-slot badge success">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-button">
                  <span>🎲</span>
                  Create Session
                </button>
                <button className="action-button secondary">
                  <span>📅</span>
                  View My Sessions
                </button>
                <button className="action-button secondary">
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
                <button className="setting-item danger">
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
