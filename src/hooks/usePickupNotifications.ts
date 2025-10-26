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
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);

  // Initialize audio context
  useEffect(() => {
    console.log('🎯 usePickupNotifications hook mounted');
    
    // Create AudioContext
    const initAudio = () => {
      if (!hasInteractedRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        hasInteractedRef.current = true;
        console.log('✅ Audio context initialized');
      }
    };

    // Initialize on first click
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    console.log('🔊 Audio system ready');

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
    
    if (!audioContextRef.current) {
      console.log('⚠️ Audio context not initialized, will play on next interaction');
      const playOnClick = () => {
        playGoogleMeetSound();
        document.removeEventListener('click', playOnClick);
      };
      document.addEventListener('click', playOnClick, { once: true });
      return;
    }

    playGoogleMeetSound();
  };

  const playGoogleMeetSound = () => {
    if (!audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;
      setIsAlarmPlaying(true);

      // Google Meet-style notification sound (3 ascending tones)
      const playMeetTone = () => {
        if (!isAlarmPlaying && intervalRef.current === null) return;

        const now = ctx.currentTime;
        
        // First tone (lower)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.value = 660; // E5
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc1.start(now);
        osc1.stop(now + 0.15);

        // Second tone (middle)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 880; // A5
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.3);

        // Third tone (higher)
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.value = 1320; // E6
        osc3.type = 'sine';
        gain3.gain.setValueAtTime(0.4, now + 0.3);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc3.start(now + 0.3);
        osc3.stop(now + 0.6);
      };

      // Play immediately
      playMeetTone();

      // Repeat every 2 seconds
      intervalRef.current = window.setInterval(playMeetTone, 2000);

      console.log('✅ Alarm playing successfully');
    } catch (error) {
      console.error('❌ Failed to play alarm:', error);
    }
  };

  const stopAlarm = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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
