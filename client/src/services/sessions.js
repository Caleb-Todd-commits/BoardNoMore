import { supabase } from '../lib/supabase';

// Get all sessions with game and host details
export const getSessions = async (filters = {}) => {
  let query = supabase
    .from('sessions')
    .select(`
      *,
      game:games(*),
      host:profiles(*),
      session_attendees(user_id)
    `)
    .order('start_time', { ascending: true });

  // Apply filters
  if (filters.gameId) {
    query = query.eq('game_id', filters.gameId);
  }
  if (filters.skillLevel) {
    query = query.eq('skill_level', filters.skillLevel);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.in('status', ['open', 'full']);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Transform attendees array
  return data.map(session => ({
    ...session,
    attendees: session.session_attendees.map(a => a.user_id)
  }));
};

// Get a single session by ID
export const getSession = async (sessionId) => {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      game:games(*),
      host:profiles(*),
      session_attendees(
        user_id,
        profiles(*)
      )
    `)
    .eq('id', sessionId)
    .single();

  if (error) throw error;

  return {
    ...data,
    attendees: data.session_attendees.map(a => a.profiles)
  };
};

// Create a new session
export const createSession = async (sessionData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to create a session');

  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        ...sessionData,
        host_id: user.id
      }
    ])
    .select()
    .single();

  if (error) throw error;

  // Automatically add host as attendee
  await joinSession(data.id);

  return data;
};

// Update a session
export const updateSession = async (sessionId, updates) => {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a session
export const deleteSession = async (sessionId) => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
};

// Join a session
export const joinSession = async (sessionId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to join a session');

  const { data, error } = await supabase
    .from('session_attendees')
    .insert([
      {
        session_id: sessionId,
        user_id: user.id,
        status: 'joined'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Leave a session
export const leaveSession = async (sessionId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('session_attendees')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', user.id);

  if (error) throw error;
};

// Get sessions hosted by a user
export const getHostedSessions = async (userId) => {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      game:games(*),
      session_attendees(user_id)
    `)
    .eq('host_id', userId)
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data.map(session => ({
    ...session,
    attendees: session.session_attendees.map(a => a.user_id)
  }));
};

// Get sessions user is attending (not hosting)
export const getAttendingSessions = async (userId) => {
  const { data, error } = await supabase
    .from('session_attendees')
    .select(`
      session:sessions(
        *,
        game:games(*),
        host:profiles(*),
        session_attendees(user_id)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'joined');

  if (error) throw error;

  return data
    .map(item => item.session)
    .filter(session => session.host_id !== userId)
    .map(session => ({
      ...session,
      attendees: session.session_attendees.map(a => a.user_id)
    }));
};

// Get nearby sessions using PostGIS
export const getNearbySessions = async (latitude, longitude, radiusMiles = 10) => {
  const { data, error } = await supabase
    .rpc('get_nearby_sessions', {
      user_lat: latitude,
      user_lng: longitude,
      radius_miles: radiusMiles
    });

  if (error) throw error;
  return data;
};
