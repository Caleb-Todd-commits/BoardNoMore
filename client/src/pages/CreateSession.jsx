import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../services/games';
import { createSession } from '../services/sessions';
import './CreateSession.css';

function CreateSession() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    game_id: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    address: '',
    capacity: 4,
    skill_level: 'all-levels',
    materials_provided: true,
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await getGames();
        setGames(gamesData);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setSubmitting(true);
      
      // Combine date and time into ISO timestamps
      const startDateTime = new Date(`${formData.date}T${formData.start_time}`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.end_time}`).toISOString();
      
      const sessionData = {
        game_id: formData.game_id,
        description: formData.description,
        start_time: startDateTime,
        end_time: endDateTime,
        location: formData.location,
        address: formData.address,
        capacity: parseInt(formData.capacity),
        skill_level: formData.skill_level,
        materials_provided: formData.materials_provided,
      };
      
      const newSession = await createSession(sessionData);
      alert('Session created successfully!');
      navigate(`/session/${newSession.id}`);
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="create-session-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      </div>
    );
  }

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
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="create-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Game Details</h2>

              <div className="form-group">
                <label htmlFor="game_id">Select Game *</label>
                <select id="game_id" value={formData.game_id} onChange={handleChange} required>
                  <option value="">Choose a game...</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.image} {game.name} ({game.min_players}-{game.max_players} players)
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
                  value={formData.description}
                  onChange={handleChange}
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
                  <input 
                    type="date" 
                    id="date" 
                    value={formData.date}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="start_time">Start Time *</label>
                  <input 
                    type="time" 
                    id="start_time" 
                    value={formData.start_time}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">End Time *</label>
                  <input 
                    type="time" 
                    id="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required 
                  />
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
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Street address or general area"
                  value={formData.address}
                  onChange={handleChange}
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
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skill_level">Skill Level *</label>
                  <select 
                    id="skill_level" 
                    value={formData.skill_level}
                    onChange={handleChange}
                    required
                  >
                    <option value="all-levels">All Levels Welcome</option>
                    <option value="beginner">Beginner Friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    id="materials_provided"
                    checked={formData.materials_provided}
                    onChange={handleChange}
                  />
                  <span>I will provide all game materials</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Session'}
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
