# BoardNoMore

This project is a webpage where people can connect with nearby players to organize and join board game sessions at times that work for them — fostering community and making planning easier.

**Overview**
- **Purpose:** Connect nearby people who want to play the same games at convenient times, reducing the friction of planning meetups.
- **Audience:** Casual and regular board-game players, local gaming groups, and community organizers.

**Key Features**
- **Discover Nearby Players:** Find other players near you using location filters.
- **Create & Join Sessions:** Create events/sessions for specific games and time slots; allow others to join.
- **Scheduling & Availability:** Indicate availability, propose times, and accept or decline invites.
- **Game Preferences:** Specify favored games, player counts, experience level, and required materials.
- **Comments & Notifications:** Comment on game sessions and receive notifications (session updates, reminders).
- **Profiles & Reputation:** User profiles, optional photos, play history, ratings or trust signals.
- **Search & Filters:** Search by game, time, location radius, player skill, and group size.
- **Safety & Moderation:** Reporting, block lists, and simple moderation tools to keep the community safe.

**User Stories**
- As a player, I want to find people nearby who play Catan so I can join a session.
- As a host, I want to create a session for Friday evening and limit to 4 players.
- As a user, I want to set my availability so I’m only shown for matching times.
- As a newcomer, I want to read hosts’ profiles and reviews before joining.
- As an organizer, I want to update participants with last-minute updates.

**High-Level Data Model (suggested)**
- **User**: id, name, email, profile, location (city / geo coords), availability, preferences.
- **Game**: id, name, minPlayers, maxPlayers, tags.
- **Session/Event**: id, hostId, gameId, location (physical or virtual), startTime, endTime, capacity, description, attendees[]
- **Comment**: id, sessionId, userId, text, timestamp, parentCommentId (for replies)
- **Report/Moderation**: id, reporterId, targetId, reason, status

**Pages / Screens**
- Landing / Discover (See current games available, but nothing else till you sign in)
- Sign Up / Sign In 
- Profile & Preferences
- Game Browse / Search Results
- Session Details
- Create Session / Host Flow
- My Sessions / Joined Sessions

**Suggested Tech Stack & Services**
- **Backend:** Node.js (CommonJS) — package.json already set to `type: commonjs`.
- **Frontend (web):** React + React Router or Next.js for SEO; or React Native if you want a mobile-first app.
- **Realtime:** WebSockets / Socket.IO for messaging and live session updates.
- **Database:** PostgreSQL (relational sessions/users) or Firebase/Firestore for quick prototyping.
- **Auth:** JWT or OAuth providers (Google, Apple) for easy sign-in.
- **Hosting:** Vercel/Netlify for frontend, Heroku / Render / DigitalOcean / AWS for backend; consider serverless for scaling.
- **Geolocation & Maps:** Browser Geolocation API + Map provider (Mapbox, Google Maps) for location features.

**API Endpoints (examples)**
- `POST /api/auth/signup` — create user
- `POST /api/auth/login` — sign in
- `GET /api/games` — list games
- `GET /api/sessions?lat=&lng=&radius=&game=` — discover sessions nearby
- `POST /api/sessions` — create session
- `POST /api/sessions/:id/join` — join a session
- `GET /api/sessions/:id/comments` — get comments for a session
- `POST /api/sessions/:id/comments` — add comment to a session
- `DELETE /api/comments/:id` — delete own comment

**Privacy & Safety Considerations**
- Avoid exposing exact home addresses; use approximate locations or meeting points.
- Provide tools to report/block users and to remove sessions from discovery.
- Limit personally identifying data shown publicly; follow GDPR/best-practices where relevant.

**Developer Setup (starter guidance)**
1. Install dependencies: `npm install` (add dependencies to `package.json`).
2. Add scripts to `package.json`, e.g. `start`, `dev`, `build`.
3. Run locally: `npm run dev` (after adding a dev script).

**Next Steps / Roadmap (suggested)**
- MVP: User signup/login, create/join session, basic discovery by radius, user profiles.
- Iteration 1: Session comments, notifications, availability scheduling.
- Iteration 2: Ratings, more robust moderation, event reminders, calendar integration.

**Contributing**
- Open issues describing features or bugs.
- Submit PRs that include tests and a short description of the change.

**License**
- See `package.json` — current license: ISC.

---
_This README is an outline crafted from the `package.json` description. I can expand any section into implementation tasks, API specs, wireframes, or a minimal runnable starter if you want._
