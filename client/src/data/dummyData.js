// Dummy data for BoardNoMore app

export const games = [
  {
    id: 1,
    name: "Catan",
    minPlayers: 3,
    maxPlayers: 4,
    tags: ["strategy", "trading", "classic"],
    image: "🏝️"
  },
  {
    id: 2,
    name: "Ticket to Ride",
    minPlayers: 2,
    maxPlayers: 5,
    tags: ["strategy", "family-friendly", "route-building"],
    image: "🚂"
  },
  {
    id: 3,
    name: "Codenames",
    minPlayers: 4,
    maxPlayers: 8,
    tags: ["party", "word-game", "team-based"],
    image: "🕵️"
  },
  {
    id: 4,
    name: "Pandemic",
    minPlayers: 2,
    maxPlayers: 4,
    tags: ["cooperative", "strategy", "challenging"],
    image: "🦠"
  },
  {
    id: 5,
    name: "Wingspan",
    minPlayers: 1,
    maxPlayers: 5,
    tags: ["strategy", "engine-building", "nature"],
    image: "🦅"
  },
  {
    id: 6,
    name: "Azul",
    minPlayers: 2,
    maxPlayers: 4,
    tags: ["abstract", "puzzle", "beautiful"],
    image: "🎨"
  },
  {
    id: 7,
    name: "7 Wonders",
    minPlayers: 2,
    maxPlayers: 7,
    tags: ["strategy", "card-game", "civilization"],
    image: "🏛️"
  },
  {
    id: 8,
    name: "Splendor",
    minPlayers: 2,
    maxPlayers: 4,
    tags: ["strategy", "engine-building", "gems"],
    image: "💎"
  }
];

export const users = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "👩",
    location: "San Francisco, CA",
    bio: "Board game enthusiast and strategy lover. Always up for Catan!",
    gamesPlayed: 47,
    rating: 4.8,
    preferences: {
      favoriteGames: [1, 2, 5],
      skillLevel: "intermediate",
      preferredPlayerCount: "3-4"
    }
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus@example.com",
    avatar: "👨",
    location: "San Francisco, CA",
    bio: "Competitive player who loves euro games. Let's strategize!",
    gamesPlayed: 89,
    rating: 4.9,
    preferences: {
      favoriteGames: [4, 5, 7],
      skillLevel: "advanced",
      preferredPlayerCount: "2-4"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    avatar: "👩‍🦱",
    location: "Oakland, CA",
    bio: "Party game enthusiast! Love hosting game nights with friends.",
    gamesPlayed: 32,
    rating: 4.7,
    preferences: {
      favoriteGames: [3, 2, 6],
      skillLevel: "beginner",
      preferredPlayerCount: "4+"
    }
  },
  {
    id: 4,
    name: "Alex Kim",
    email: "alex@example.com",
    avatar: "🧑",
    location: "Berkeley, CA",
    bio: "New to the scene but eager to learn! Favorite so far: Ticket to Ride",
    gamesPlayed: 12,
    rating: 4.6,
    preferences: {
      favoriteGames: [2, 8, 6],
      skillLevel: "beginner",
      preferredPlayerCount: "2-4"
    }
  }
];

export const sessions = [
  {
    id: 1,
    hostId: 1,
    gameId: 1,
    game: games[0],
    host: users[0],
    location: "Clockwork Cafe, San Francisco",
    address: "123 Mission St, San Francisco, CA",
    startTime: "2025-12-15T18:00:00",
    endTime: "2025-12-15T21:00:00",
    capacity: 4,
    attendees: [1, 2],
    description: "Casual Catan game at a cozy cafe. Bring good vibes and your trading skills! Coffee and snacks available for purchase.",
    status: "open",
    skillLevel: "all-levels",
    materialsProvided: true
  },
  {
    id: 2,
    hostId: 2,
    gameId: 4,
    game: games[3],
    host: users[1],
    location: "Marcus's Place",
    address: "Near downtown SF (exact address shared after joining)",
    startTime: "2025-12-14T19:00:00",
    endTime: "2025-12-14T22:00:00",
    capacity: 4,
    attendees: [2, 3, 4],
    description: "Save the world from diseases! Looking for experienced players for a challenging Pandemic session. I have all expansions.",
    status: "open",
    skillLevel: "intermediate",
    materialsProvided: true
  },
  {
    id: 3,
    hostId: 3,
    gameId: 3,
    game: games[2],
    host: users[2],
    location: "Oakland Community Center",
    address: "456 Telegraph Ave, Oakland, CA",
    startTime: "2025-12-16T15:00:00",
    endTime: "2025-12-16T18:00:00",
    capacity: 8,
    attendees: [3, 1, 4, 2],
    description: "Party game afternoon! Great for newcomers. We'll play multiple rounds of Codenames and maybe some other party games.",
    status: "open",
    skillLevel: "all-levels",
    materialsProvided: true
  },
  {
    id: 4,
    hostId: 1,
    gameId: 2,
    game: games[1],
    host: users[0],
    location: "Board Game Lounge SF",
    address: "789 Valencia St, San Francisco, CA",
    startTime: "2025-12-13T17:30:00",
    endTime: "2025-12-13T20:00:00",
    capacity: 4,
    attendees: [1, 2, 3, 4],
    description: "Ticket to Ride evening at the best board game venue in town. All routes welcome!",
    status: "full",
    skillLevel: "all-levels",
    materialsProvided: true
  },
  {
    id: 5,
    hostId: 4,
    gameId: 5,
    game: games[4],
    host: users[3],
    location: "Berkeley Public Library",
    address: "2090 Kittredge St, Berkeley, CA",
    startTime: "2025-12-17T14:00:00",
    endTime: "2025-12-17T17:00:00",
    capacity: 4,
    attendees: [4],
    description: "First time hosting! Let's enjoy the beautiful game of Wingspan together. Patient players welcome as I'm still learning the rules.",
    status: "open",
    skillLevel: "beginner",
    materialsProvided: true
  },
  {
    id: 6,
    hostId: 2,
    gameId: 7,
    game: games[6],
    host: users[1],
    location: "Bay Area Board Gamers Club",
    address: "321 Market St, San Francisco, CA",
    startTime: "2025-12-18T18:00:00",
    endTime: "2025-12-18T21:00:00",
    capacity: 5,
    attendees: [2, 1],
    description: "Epic 7 Wonders session with experienced players. We'll be using the Leaders expansion. Come build your civilization!",
    status: "open",
    skillLevel: "advanced",
    materialsProvided: true
  }
];

export const comments = [
  {
    id: 1,
    sessionId: 1,
    userId: 2,
    user: users[1],
    text: "Looking forward to this! Should I bring any snacks to share?",
    timestamp: "2025-12-10T14:30:00",
    parentCommentId: null
  },
  {
    id: 2,
    sessionId: 1,
    userId: 1,
    user: users[0],
    text: "That would be awesome! Maybe some chips or cookies?",
    timestamp: "2025-12-10T15:00:00",
    parentCommentId: 1
  },
  {
    id: 3,
    sessionId: 2,
    userId: 3,
    user: users[2],
    text: "Never played Pandemic before, is that okay?",
    timestamp: "2025-12-09T10:00:00",
    parentCommentId: null
  },
  {
    id: 4,
    sessionId: 2,
    userId: 2,
    user: users[1],
    text: "Hmm, this session is marked intermediate. I'd recommend trying a beginner session first!",
    timestamp: "2025-12-09T11:00:00",
    parentCommentId: 3
  },
  {
    id: 5,
    sessionId: 3,
    userId: 4,
    user: users[3],
    text: "Is parking available nearby?",
    timestamp: "2025-12-11T09:00:00",
    parentCommentId: null
  },
  {
    id: 6,
    sessionId: 3,
    userId: 3,
    user: users[2],
    text: "Yes! There's a lot right next to the center. First 2 hours free!",
    timestamp: "2025-12-11T09:30:00",
    parentCommentId: 5
  }
];

export const currentUser = {
  id: 1,
  name: "Sarah Chen",
  email: "sarah@example.com",
  avatar: "👩",
  location: "San Francisco, CA",
  bio: "Board game enthusiast and strategy lover. Always up for Catan!",
  gamesPlayed: 47,
  rating: 4.8,
  preferences: {
    favoriteGames: [1, 2, 5],
    skillLevel: "intermediate",
    preferredPlayerCount: "3-4",
    willingToHost: true,
    maxTravelDistance: 10
  },
  availability: [
    { day: "monday", times: ["evening"] },
    { day: "wednesday", times: ["evening"] },
    { day: "friday", times: ["evening", "night"] },
    { day: "saturday", times: ["afternoon", "evening"] },
    { day: "sunday", times: ["afternoon"] }
  ]
};
