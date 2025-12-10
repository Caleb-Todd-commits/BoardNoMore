import { supabase } from '../lib/supabase';

// Get all games
export const getGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// Get a single game
export const getGame = async (gameId) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error) throw error;
  return data;
};

// Search games by name
export const searchGames = async (searchTerm) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// Filter games by tags
export const getGamesByTags = async (tags) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .overlaps('tags', tags)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};
