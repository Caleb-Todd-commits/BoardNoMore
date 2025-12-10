import { supabase } from '../lib/supabase';

// Get comments for a session
export const getComments = async (sessionId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// Create a comment
export const createComment = async (sessionId, text, parentCommentId = null) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to comment');

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        session_id: sessionId,
        user_id: user.id,
        text,
        parent_comment_id: parentCommentId
      }
    ])
    .select(`
      *,
      user:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data;
};

// Update a comment
export const updateComment = async (commentId, text) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ text, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

// Subscribe to new comments on a session
export const subscribeToComments = (sessionId, callback) => {
  return supabase
    .channel(`comments:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `session_id=eq.${sessionId}`
      },
      callback
    )
    .subscribe();
};
