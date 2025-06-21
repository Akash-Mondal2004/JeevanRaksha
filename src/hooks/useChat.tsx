import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from '@/integrations/supabase/types';

export const useChat = (userId: string) => {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select(`
            *,
            sender_profile:profiles!chat_messages_sender_id_fkey(
              id,
              full_name,
              user_type
            ),
            receiver_profile:profiles!chat_messages_receiver_id_fkey(
              id,
              full_name,
              user_type
            )
          `)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (mounted) setChats(data || []);
      } catch (err) {
        console.error('Error fetching chats:', err);
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Clean up previous subscription if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up new subscription
    channelRef.current = supabase
      .channel(`chat:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${userId}`,
      }, 
      (payload) => {
        if (mounted) {
          fetchChats(); // Refetch to get the related data
        }
      })
      .subscribe();

    fetchChats();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId]);

  return { chats, loading, error };
};