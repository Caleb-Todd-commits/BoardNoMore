import { supabase } from '../lib/supabase';

// Get a user profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      favorite_games:user_favorite_games(
        game:games(*)
      ),
      availability:user_availability(*)
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;

  return {
    ...data,
    favorite_games: data.favorite_games.map(fg => fg.game),
    availability: data.availability
  };
};

// Update user profile
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Add a favorite game
export const addFavoriteGame = async (gameId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('user_favorite_games')
    .insert([
      {
        user_id: user.id,
        game_id: gameId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Remove a favorite game
export const removeFavoriteGame = async (gameId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  const { error } = await supabase
    .from('user_favorite_games')
    .delete()
    .eq('user_id', user.id)
    .eq('game_id', gameId);

  if (error) throw error;
};

// Set user availability
export const setAvailability = async (availability) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Delete existing availability
  await supabase
    .from('user_availability')
    .delete()
    .eq('user_id', user.id);

  // Insert new availability
  const insertData = availability.flatMap(avail =>
    avail.times.map(time => ({
      user_id: user.id,
      day_of_week: avail.day,
      time_slot: time
    }))
  );

  const { data, error } = await supabase
    .from('user_availability')
    .insert(insertData)
    .select();

  if (error) throw error;
  return data;
};

// Get user's availability
export const getAvailability = async (userId) => {
  const { data, error } = await supabase
    .from('user_availability')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  // Group by day
  const grouped = data.reduce((acc, item) => {
    const existing = acc.find(a => a.day === item.day_of_week);
    if (existing) {
      existing.times.push(item.time_slot);
    } else {
      acc.push({
        day: item.day_of_week,
        times: [item.time_slot]
      });
    }
    return acc;
  }, []);

  return grouped;
};
