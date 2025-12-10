import { games } from '../data/dummyData';
import './CreateSession.css';

function CreateSession() {
  return (
    <div className="create-session-page">
      <div className="container">
        <div className="create-header">
          <h1>Create a New Session</h1>
          <p className="create-subtitle">
            Host a game night and invite players from your community
          </p>
        </div>

        <div className="create-content">
          <form className="create-form">
            <div className="form-section">
              <h2>Game Details</h2>

              <div className="form-group">
                <label htmlFor="game">Select Game *</label>
                <select id="game" required>
                  <option value="">Choose a game...</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.image} {game.name} ({game.minPlayers}-{game.maxPlayers} players)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows="5"
                  placeholder="Describe your session, what kind of players you're looking for, and any special details..."
                  required
                />
                <small>Be specific! Mention experience level, house rules, or what makes this session special.</small>
              </div>
            </div>

            <div className="form-section">
              <h2>Date & Time</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input type="date" id="date" required />
                </div>

                <div className="form-group">
                  <label htmlFor="start-time">Start Time *</label>
                  <input type="time" id="start-time" required />
                </div>

                <div className="form-group">
                  <label htmlFor="end-time">End Time *</label>
                  <input type="time" id="end-time" required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Location</h2>

              <div className="form-group">
                <label htmlFor="location">Venue Name *</label>
                <input
                  type="text"
                  id="location"
                  placeholder="e.g., Coffee Shop, Community Center, or My Home"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Street address or general area"
                  required
                />
                <small>For home games, you can share the exact address only with confirmed attendees.</small>
              </div>
            </div>

            <div className="form-section">
              <h2>Session Settings</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacity">Max Players *</label>
                  <input
                    type="number"
                    id="capacity"
                    min="2"
                    max="20"
                    defaultValue="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skill-level">Skill Level *</label>
                  <select id="skill-level" required>
                    <option value="all-levels">All Levels Welcome</option>
                    <option value="beginner">Beginner Friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>I will provide all game materials</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Allow attendees to bring guests</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary">
                Save as Draft
              </button>
              <button type="submit">
                Create Session
              </button>
            </div>
          </form>

          <div className="create-sidebar">
            <div className="card">
              <h3>Tips for a Great Session</h3>
              <ul className="tips-list">
                <li>
                  <strong>Be clear about experience level</strong> - Help players know if this session is right for them
                </li>
                <li>
                  <strong>Choose accessible locations</strong> - Public venues work great for first-time meetups
                </li>
                <li>
                  <strong>Set realistic time expectations</strong> - Account for setup, teaching, and multiple rounds
                </li>
                <li>
                  <strong>Communicate materials</strong> - Let players know what to bring (if anything)
                </li>
                <li>
                  <strong>Respond to comments</strong> - Answer questions quickly to build trust
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Safety Reminder</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Always meet in public places for first-time meetups. Never share personal information publicly. Use our messaging system to coordinate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
