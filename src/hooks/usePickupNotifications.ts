import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewPickupRequest {
  id: string;
  customer_name: string;
  user_phone: string;
  verified_phone?: string;
  is_phone_verified?: boolean;
  device?: {
    brand: { name: string };
    model_name: string;
  };
  final_price: number;
  created_at: string;
  city?: { name: string };
  pickup_date?: string;
  pickup_time?: string;
}

export function usePickupNotifications() {
  const [newRequest, setNewRequest] = useState<NewPickupRequest | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    console.log('🎯 usePickupNotifications hook mounted');
    
    // Create Audio element with your custom sound
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.loop = true; // Loop the sound continuously
    audioRef.current.volume = 0.8; // Set volume (0.0 to 1.0) - adjust as needed
    
    console.log('✅ Audio element initialized with notification.mp3');

    const initAudio = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        console.log('✅ User interaction detected, audio ready');
      }
    };

    // Initialize on first interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    console.log('🔊 Audio system ready');

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, []);

  // Setup realtime subscription
  useEffect(() => {
    console.log('📡 Setting up realtime subscription...');
    
    const channel = supabase
      .channel('pickup-requests-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pickup_requests',
          filter: 'status=eq.pending',
        },
        async (payload) => {
          console.log('🔔 NEW PICKUP REQUEST DETECTED!', payload);
          
          // Fetch full request details with relationships
          const { data, error } = await supabase
            .from('pickup_requests')
            .select(`
              *,
              device:devices(
                brand:brands(name),
                model_name
              ),
              city:cities(name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('❌ Error fetching request details:', error);
            return;
          }

          console.log('📦 Full request data:', data);
          setNewRequest(data);
          
          // Play alarm
          playAlarm();
          
          // Show browser notification
          showBrowserNotification(data);
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const playAlarm = () => {
    console.log('🔊 Attempting to play alarm...');
    
    if (!audioRef.current) {
      console.error('❌ Audio element not initialized');
      return;
    }

    try {
      setIsAlarmPlaying(true);
      
      // Reset audio to start
      audioRef.current.currentTime = 0;
      
      // Play the audio
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Notification sound playing (notification.mp3)');
          })
          .catch(error => {
            console.error('❌ Failed to play sound:', error);
            // Try to play on next user interaction
            const playOnClick = () => {
              if (audioRef.current) {
                audioRef.current.play().catch(console.error);
              }
              document.removeEventListener('click', playOnClick);
            };
            document.addEventListener('click', playOnClick, { once: true });
          });
      }
    } catch (error) {
      console.error('❌ Failed to play alarm:', error);
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
    console.log('🔇 Alarm stopped');
  };

  const showBrowserNotification = (request: NewPickupRequest) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 New Pickup Request!', {
        body: `${request.customer_name} - ₹${request.final_price.toLocaleString('en-IN')}`,
        icon: '/logo.png',
        badge: '/logo.png',
        requireInteraction: true,
        tag: request.id,
      });
      console.log('📬 Browser notification sent');
    } else {
      console.log('⚠️ Notification permission denied');
    }
  };

  const acceptRequest = async () => {
    if (!newRequest) return;

    console.log('✅ Accepting request:', newRequest.id);
    
    // Stop alarm first
    stopAlarm();

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const username = user?.user_metadata?.username || user?.email || 'sahilpasha20';

      const { error } = await supabase
        .from('pickup_requests')
        .update({
          status: 'confirmed',
          updated_by: username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', newRequest.id);

      if (error) throw error;

      console.log('✅ Request accepted and status updated to confirmed');
      
      // Clear the notification
      setNewRequest(null);
      
    } catch (error) {
      console.error('❌ Error accepting request:', error);
      // Still clear the notification even if update fails
      setNewRequest(null);
    }
  };

  return {
    newRequest,
    isAlarmPlaying,
    acceptRequest,
  };
}