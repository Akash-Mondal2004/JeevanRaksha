    import { useEffect } from 'react';
    import { supabase } from '@/integrations/supabase/client';
    import { useUserLocation } from '@/hooks/updateUserLocation';
    import type { UserType } from '@/integrations/supabase/types';

    interface LocationTrackerProps {
    userId: string;
    userType: UserType;
    }

    export const LocationTracker = ({ userId, userType }: LocationTrackerProps) => {
    const { updateUserLocation } = useUserLocation({ userId, userType });

    useEffect(() => {
        // Subscribe to location updates
        const subscription = supabase
        .channel(`user_location_${userId}`)
        .on('postgres_changes', 
            {
            event: '*',
            schema: 'public',
            table: 'user_locations',
            filter: `user_id=eq.${userId}`
            },
            (payload) => {
            console.log('Location updated:', payload);
            }
        )
        .subscribe();

        // Watch for user's position changes
        const watchId = navigator.geolocation.watchPosition(
        (position) => {
            updateUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
            });
        },
        (error) => {
            console.error('Error watching position:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
        );

        return () => {
        subscription.unsubscribe();
        navigator.geolocation.clearWatch(watchId);
        };
    }, [userId]);

    return null;
    };