-- BoardNoMore Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable PostGIS for geolocation features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bio TEXT,
  games_played INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_player_count TEXT,
  willing_to_host BOOLEAN DEFAULT false,
  max_travel_distance INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_players INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'all-levels')),
  materials_provided BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session attendees (many-to-many relationship)
CREATE TABLE public.session_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'joined' CHECK (status IN ('joined', 'left', 'removed')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User availability table
CREATE TABLE public.user_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  time_slot TEXT CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'night')),
  UNIQUE(user_id, day_of_week, time_slot)
);

-- Favorite games (many-to-many relationship)
CREATE TABLE public.user_favorite_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Reports/Moderation table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_sessions_host_id ON public.sessions(host_id);
CREATE INDEX idx_sessions_game_id ON public.sessions(game_id);
CREATE INDEX idx_sessions_start_time ON public.sessions(start_time);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE INDEX idx_session_attendees_session_id ON public.session_attendees(session_id);
CREATE INDEX idx_session_attendees_user_id ON public.session_attendees(user_id);
CREATE INDEX idx_comments_session_id ON public.comments(session_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);

-- Create spatial index for geolocation queries
-- Note: This creates a functional index on the geography column
CREATE INDEX idx_sessions_location ON public.sessions USING GIST (
  CAST(ST_MakePoint(longitude, latitude) AS geography)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Games policies (read-only for now, admins can add via SQL)
CREATE POLICY "Games are viewable by everyone"
  ON public.games FOR SELECT
  USING (true);

-- Sessions policies
CREATE POLICY "Sessions are viewable by everyone"
  ON public.sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can create sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = host_id);

-- Session attendees policies
CREATE POLICY "Attendees are viewable by everyone"
  ON public.session_attendees FOR SELECT
  USING (true);

CREATE POLICY "Users can join sessions"
  ON public.session_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions"
  ON public.session_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- User availability policies
CREATE POLICY "Users can view their own availability"
  ON public.user_availability FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own availability"
  ON public.user_availability FOR ALL
  USING (auth.uid() = user_id);

-- Favorite games policies
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorite_games FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON public.user_favorite_games FOR ALL
  USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Functions

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update session status based on capacity
CREATE OR REPLACE FUNCTION public.update_session_status()
RETURNS TRIGGER AS $$
DECLARE
  attendee_count INTEGER;
  session_capacity INTEGER;
BEGIN
  SELECT capacity INTO session_capacity
  FROM public.sessions
  WHERE id = NEW.session_id;

  SELECT COUNT(*) INTO attendee_count
  FROM public.session_attendees
  WHERE session_id = NEW.session_id AND status = 'joined';

  IF attendee_count >= session_capacity THEN
    UPDATE public.sessions
    SET status = 'full'
    WHERE id = NEW.session_id;
  ELSE
    UPDATE public.sessions
    SET status = 'open'
    WHERE id = NEW.session_id AND status = 'full';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update session status
CREATE TRIGGER on_attendee_change
  AFTER INSERT OR UPDATE OR DELETE ON public.session_attendees
  FOR EACH ROW EXECUTE FUNCTION public.update_session_status();

-- Function to get nearby sessions (using PostGIS)
CREATE OR REPLACE FUNCTION public.get_nearby_sessions(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles DECIMAL DEFAULT 10
)
RETURNS TABLE (
  session_id UUID,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id as session_id,
    (ST_Distance(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(s.longitude, s.latitude)::geography
    ) / 1609.34)::DECIMAL as distance_miles
  FROM public.sessions s
  WHERE s.latitude IS NOT NULL
    AND s.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(s.longitude, s.latitude)::geography,
      radius_miles * 1609.34
    )
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Insert sample games
INSERT INTO public.games (name, min_players, max_players, image, tags) VALUES
  ('Catan', 3, 4, '🏝️', ARRAY['strategy', 'trading', 'classic']),
  ('Ticket to Ride', 2, 5, '🚂', ARRAY['strategy', 'family-friendly', 'route-building']),
  ('Codenames', 4, 8, '🕵️', ARRAY['party', 'word-game', 'team-based']),
  ('Pandemic', 2, 4, '🦠', ARRAY['cooperative', 'strategy', 'challenging']),
  ('Wingspan', 1, 5, '🦅', ARRAY['strategy', 'engine-building', 'nature']),
  ('Azul', 2, 4, '🎨', ARRAY['abstract', 'puzzle', 'beautiful']),
  ('7 Wonders', 2, 7, '🏛️', ARRAY['strategy', 'card-game', 'civilization']),
  ('Splendor', 2, 4, '💎', ARRAY['strategy', 'engine-building', 'gems']);
