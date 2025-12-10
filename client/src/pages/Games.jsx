import { useState, useEffect } from 'react';
import { getGames } from '../services/games';
import { getSessions } from '../services/sessions';
import './Games.css';

function Games() {
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesData, sessionsData] = await Promise.all([
          getGames(),
          getSessions()
        ]);
        setGames(gamesData);
        setSessions(sessionsData);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSessionCount = (gameId) => {
    return sessions.filter(s => s.game_id === gameId).length;
  };

  if (loading) {
    return (
      <div className="games-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading games...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '16px', color: '#c33', backgroundColor: '#fee', padding: '20px', borderRadius: '8px' }}>
            Error loading games: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      <div className="container">
        <div className="games-header">
          <h1>Browse Games</h1>
          <p className="games-subtitle">
            Explore our collection of board games and find sessions to join
          </p>

          <div className="games-search">
            <input
              type="text"
              placeholder="Search for a game..."
              className="games-search-input"
            />
          </div>

          <div className="games-filters">
            <button className="filter-chip active">All</button>
            <button className="filter-chip">Strategy</button>
            <button className="filter-chip">Party</button>
            <button className="filter-chip">Cooperative</button>
            <button className="filter-chip">Family-Friendly</button>
          </div>
        </div>

        <div className="games-grid">
          {games.map(game => {
            const sessionCount = getSessionCount(game.id);
            return (
              <div key={game.id} className="game-card">
                <div className="game-card-header">
                  <span className="game-card-icon">{game.image}</span>
                  <div className="game-card-info">
                    <h3 className="game-card-title">{game.name}</h3>
                    <div className="game-card-players">
                      👥 {game.minPlayers}-{game.maxPlayers} players
                    </div>
                  </div>
                </div>

                <div className="game-card-tags">
                  {game.tags?.map(tag => (
                    <span key={tag} className="game-tag">
                      #{tag}
                    </span>
                  )) || <span className="game-tag">No tags</span>}
                </div>

                <div className="game-card-footer">
                  <div className="session-count">
                    {sessionCount > 0 ? (
                      <span className="sessions-available">
                        🎲 {sessionCount} session{sessionCount !== 1 ? 's' : ''} available
                      </span>
                    ) : (
                      <span className="no-sessions">No events yet</span>
                    )}
                  </div>
                  <button className="secondary">View Events</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="add-game-cta">
          <div className="cta-content">
            <h2>Don't see your favorite game?</h2>
            <p>Request to add a new game to our collection</p>
            <button className="secondary">Request a Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Games;
