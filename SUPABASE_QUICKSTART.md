# 🚀 Supabase Quick Start

## What Just Happened?

Your BoardNoMore app is now **fully connected to Supabase**! Here's what's ready:

✅ Supabase JavaScript client installed
✅ Complete database schema with all tables
✅ Authentication system (email + OAuth)
✅ API service layer for all features
✅ Real-time subscriptions
✅ Geolocation support (PostGIS)
✅ Row-level security configured

## 📁 New Files Created

```
BoardNoMore/
├── supabase-schema.sql          # Complete database schema
├── SUPABASE_SETUP.md            # Detailed setup guide
└── client/
    ├── .env.example             # Environment variables template
    ├── src/
    │   ├── lib/
    │   │   └── supabase.js      # Supabase client config
    │   └── services/
    │       ├── auth.js          # Authentication functions
    │       ├── sessions.js      # Session CRUD & queries
    │       ├── games.js         # Games API
    │       ├── comments.js      # Comments & real-time
    │       └── profiles.js      # User profiles
```

## ⚡ 5-Minute Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create account & new project
- Wait 2-3 minutes for setup

### 2. Run Database Schema
- Open Supabase dashboard → SQL Editor
- Copy ALL content from `supabase-schema.sql`
- Paste & run in SQL Editor
- Done! ✅

### 3. Get Your Credentials
- Settings → API in Supabase
- Copy **Project URL** and **anon key**

### 4. Configure App
```bash
# Create .env file in client folder
cd client
cp .env.example .env

# Edit .env with your credentials
VITE_SUPABASE_URL=your-url-here.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### 5. Restart Dev Server
```bash
npm run dev
```

## 🎯 Ready to Use!

All API functions are ready in `client/src/services/`:

```javascript
// Authentication
import { signUp, signIn, signOut } from './services/auth';
await signIn('email@example.com', 'password');

// Get sessions
import { getSessions } from './services/sessions';
const sessions = await getSessions();

// Join a session
import { joinSession } from './services/sessions';
await joinSession(sessionId);

// Add a comment
import { createComment } from './services/comments';
await createComment(sessionId, 'Great game!');
```

## 📚 Full Documentation

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for:
- Detailed setup instructions
- API usage examples
- OAuth setup (Google/Apple)
- Authentication context
- Troubleshooting
- Database structure

## 🔐 Security

- ✅ `.env` is gitignored (credentials safe)
- ✅ Row Level Security enabled
- ✅ Users can only modify their own data
- ✅ All queries are secure by default

## 🎉 What's Next?

1. Follow setup steps in `SUPABASE_SETUP.md`
2. Update your components to use Supabase services
3. Replace dummy data with real API calls
4. Add loading states and error handling
5. Test with real users!

## 💡 Example: Update a Component

Before (dummy data):
```javascript
import { sessions } from '../data/dummyData';
```

After (Supabase):
```javascript
import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessions';

const [sessions, setSessions] = useState([]);

useEffect(() => {
  getSessions().then(setSessions);
}, []);
```

## 🆘 Need Help?

Check the troubleshooting section in `SUPABASE_SETUP.md` or:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

---

You're ready to build with real data! 🎲
