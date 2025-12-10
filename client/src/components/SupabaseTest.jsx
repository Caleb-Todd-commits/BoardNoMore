import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getGames } from '../services/games';

function SupabaseTest() {
  const [status, setStatus] = useState('checking');
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check if Supabase client is configured
      const url = supabase.supabaseUrl;
      if (!url || url.includes('placeholder')) {
        setStatus('❌ No credentials');
        setError('Supabase credentials not found in .env file');
        return;
      }

      // Test 2: Try to fetch games from database
      const gamesData = await getGames();
      setGames(gamesData);
      setStatus('✅ Connected');
    } catch (err) {
      setStatus('❌ Error');
      setError(err.message);
      console.error('Supabase connection error:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '1rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #e7e5e4',
      minWidth: '250px',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
        Supabase Status: {status}
      </div>

      {error && (
        <div style={{ color: '#c1444a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      {games.length > 0 && (
        <div style={{ fontSize: '0.9rem', color: '#57534e' }}>
          <div>✓ Found {games.length} games in database</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            {games.slice(0, 3).map(g => (
              <div key={g.id}>{g.image} {g.name}</div>
            ))}
            {games.length > 3 && <div>+ {games.length - 3} more...</div>}
          </div>
        </div>
      )}

      <button
        onClick={testConnection}
        style={{
          marginTop: '0.75rem',
          padding: '0.5rem 1rem',
          background: '#4a7ba7',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          width: '100%'
        }}
      >
        Test Again
      </button>
    </div>
  );
}

export default SupabaseTest;
