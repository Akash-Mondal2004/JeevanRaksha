import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserLocation, UserType } from '@/integrations/supabase/types';

interface UseUserLocationProps {
  userId: string;
  userType: UserType;
}

export const useUserLocation = ({ userId, userType }: UseUserLocationProps) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUserLocation = async (coords: { lat: number; lng: number }) => {
    try {
      const locationData = {
        user_id: userId,
        user_type: userType,
        location: coords,
        last_updated: new Date().toISOString(),
        is_active: true
      };

      const { data, error: upsertError } = await supabase
        .from('user_locations')
        .upsert([locationData])
        .select()
        .single();

      if (upsertError) throw upsertError;
      setLocation(data);
      
      // Also update the profile location
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ location: coords })
        .eq('id', userId);

      if (profileError) throw profileError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    }
  };

  // Fetch initial location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_locations')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [userId]);

  return {
    location,
    loading,
    error,
    updateUserLocation
  };
};