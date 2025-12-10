# BoardNoMore - Supabase Setup Guide

## 🎯 What We've Built

Your BoardNoMore app is now connected to Supabase! Here's what's ready:

✅ **Database Schema** - Complete PostgreSQL schema with all tables
✅ **Authentication** - Email/password + OAuth (Google/Apple)
✅ **API Services** - Ready-to-use functions for all features
✅ **Real-time** - Live updates for comments and sessions
✅ **Geolocation** - PostGIS for nearby session searches
✅ **Security** - Row Level Security (RLS) policies configured

## 📋 Setup Steps

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in:
   - **Name**: BoardNoMore
   - **Database Password**: (save this somewhere safe)
   - **Region**: Choose closest to your target users
5. Wait 2-3 minutes for project to be created

### Step 2: Run the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

This creates:
- All database tables (users, games, sessions, comments, etc.)
- Security policies (Row Level Security)
- Indexes for performance
- Geolocation functions (PostGIS)
- Sample game data

### Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, click **Settings** → **API**
2. Find these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

### Step 4: Configure Your App

1. In your project, create a file: `client/.env`
2. Copy the contents from `client/.env.example`:

```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace with your actual values from Step 3
4. **Important**: Add `.env` to `.gitignore` (already done)

### Step 5: Enable OAuth Providers (Optional)

For Google and Apple sign-in:

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. In Supabase: **Authentication** → **Providers** → **Google**
6. Paste your Google Client ID and Secret
7. Copy the callback URL to Google Console

**Apple:**
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a Services ID
3. Configure Sign in with Apple
4. In Supabase: **Authentication** → **Providers** → **Apple**
5. Enter your credentials

### Step 6: Test the Connection

1. Start your dev server:
```bash
cd client
npm run dev
```

2. Open the browser console (F12)
3. You should NOT see the warning: "⚠️ Supabase credentials not found"
4. If you see it, check your `.env` file

## 🔧 Using the API Services

All the Supabase functions are ready in `client/src/services/`:

### Authentication (`auth.js`)

```javascript
import { signUp, signIn, signOut, getCurrentUser } from './services/auth';

// Sign up
await signUp('user@example.com', 'password', 'John Doe', 'San Francisco, CA');

// Sign in
await signIn('user@example.com', 'password');

// Sign in with Google
await signInWithGoogle();

// Get current user
const user = await getCurrentUser();

// Sign out
await signOut();
```

### Sessions (`sessions.js`)

```javascript
import { getSessions, createSession, joinSession } from './services/sessions';

// Get all sessions
const sessions = await getSessions();

// Filter sessions
const sessions = await getSessions({
  gameId: 'uuid-here',
  skillLevel: 'beginner'
});

// Create a session
await createSession({
  game_id: gameId,
  location: 'Coffee Shop',
  address: '123 Main St',
  start_time: '2025-12-15T18:00:00',
  end_time: '2025-12-15T21:00:00',
  capacity: 4,
  description: 'Casual game night!',
  skill_level: 'all-levels'
});

// Join a session
await joinSession(sessionId);

// Get nearby sessions (with coordinates)
const nearby = await getNearbySessions(37.7749, -122.4194, 10); // SF, 10 miles
```

### Games (`games.js`)

```javascript
import { getGames, searchGames } from './services/games';

// Get all games
const games = await getGames();

// Search games
const results = await searchGames('Catan');
```

### Comments (`comments.js`)

```javascript
import { getComments, createComment } from './services/comments';

// Get comments for a session
const comments = await getComments(sessionId);

// Add a comment
await createComment(sessionId, 'Looking forward to this!');

// Real-time subscription
const subscription = subscribeToComments(sessionId, (payload) => {
  console.log('New comment:', payload.new);
});

// Unsubscribe when done
subscription.unsubscribe();
```

### Profiles (`profiles.js`)

```javascript
import { getProfile, updateProfile, addFavoriteGame } from './services/profiles';

// Get a user profile
const profile = await getProfile(userId);

// Update profile
await updateProfile(userId, {
  bio: 'Love strategy games!',
  skill_level: 'intermediate'
});

// Add favorite game
await addFavoriteGame(gameId);
```

## 🔄 Updating Your Components

To connect your existing pages to Supabase:

### Example: Update Discover Page

```javascript
// client/src/pages/Discover.jsx
import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessions';

function Discover() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="discover-page">
      {/* Your existing UI */}
    </div>
  );
}
```

## 🔐 Authentication Context

For managing auth state across your app, you can create a context:

```javascript
// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser } from '../services/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(setUser).finally(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

Then wrap your app:

```javascript
// client/src/App.jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </AuthProvider>
  );
}
```

## 📊 Database Structure

Your database has these main tables:

- **profiles** - User profiles (extends Supabase auth.users)
- **games** - Board games catalog
- **sessions** - Game sessions/events
- **session_attendees** - Who's attending which sessions
- **comments** - Comments on sessions
- **user_availability** - User's availability schedule
- **user_favorite_games** - User's favorite games
- **reports** - Moderation/reporting system

## 🔍 Testing Your Setup

1. **Check Tables**: In Supabase dashboard → **Table Editor**
   - You should see all tables listed
   - Click on `games` to see the 8 sample games

2. **Test Auth**:
   - Go to **Authentication** → **Users**
   - Try signing up a test user in your app
   - User should appear here

3. **Test API**:
   - Open browser console
   - Import and call a function:
   ```javascript
   import { getGames } from './services/games';
   const games = await getGames();
   console.log(games);
   ```

## 🚀 Next Steps

Now that Supabase is connected:

1. **Update dummy data imports** to use Supabase functions
2. **Add loading states** to your components
3. **Handle errors** gracefully
4. **Add auth protection** to routes that need it
5. **Test all features** with real data
6. **Deploy** when ready!

## 📝 Important Notes

- **Free tier limits**:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth/month
  - 50,000 monthly active users

- **Security**:
  - Never commit `.env` file
  - Row Level Security is enabled
  - Users can only modify their own data

- **Performance**:
  - Indexes are already set up
  - PostGIS enabled for location queries
  - Real-time subscriptions available

## 🆘 Troubleshooting

**"Supabase credentials not found"**
- Check `.env` file exists in `client/` folder
- Verify variable names start with `VITE_`
- Restart dev server after creating `.env`

**"No rows returned" error**
- Check Row Level Security policies
- Make sure user is authenticated for protected routes
- Verify table exists in Supabase

**OAuth not working**
- Check redirect URLs match in provider settings
- Verify provider is enabled in Supabase
- Check credentials are correct

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostGIS Documentation](https://postgis.net/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

You're all set! Your BoardNoMore app is now powered by Supabase. 🎉
