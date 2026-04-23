import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { BellRing, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PickupRequest {
  id: string;
  order_id?: string;
  customer_name: string;
  user_phone: string;
  final_price: number | null;
  created_at: string;
  device?: {
    model_name: string;
    brand: {
      name: string;
    };
  } | null;
  city?: {
    name: string;
  } | null;
}

function GlobalPickupNotifications() {
  const [newOrderAlertOpen, setNewOrderAlertOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState<PickupRequest | null>(null);
  const prevRequestCountRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertIdRef = useRef<string | null>(typeof window !== 'undefined' ? localStorage.getItem('admin_last_pickup_alert_id') : null);
  const audioPrimedRef = useRef(false);
  const beepIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const transformRecord = (item: any): PickupRequest => ({
    id: item.id,
    order_id: item.order_id,
    customer_name: item.customer_name,
    user_phone: item.user_phone,
    final_price: item.final_price,
    created_at: item.created_at,
    device: item.device ? {
      model_name: item.device.model_name,
      brand: { name: item.device.brand?.name || 'Unknown' },
    } : null,
    city: item.city ? { name: item.city.name } : null,
  });

  // Initialize Audio with fallback support
  useEffect(() => {
    const tryLoadAudio = async () => {
      // Try multiple audio formats
      const audioFormats = [
        '/notification.mp3',
        '/notification.wav',
        '/notification.ogg'
      ];

      for (const format of audioFormats) {
        try {
          const audio = new Audio(format);
          
          // Wait for audio to be loadable
          await new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.addEventListener('error', reject, { once: true });
            audio.load();
          });

          console.log(`✅ Audio loaded successfully: ${format}`);
          audioRef.current = audio;
          audioRef.current.loop = true;
          return;
        } catch (err) {
          console.warn(`⚠️ Failed to load ${format}, trying next format...`);
        }
      }

      // If all formats fail, use Web Audio API to create a beep
      console.warn('⚠️ All audio formats failed, using Web Audio API beep');
      createWebAudioBeep();
    };

    const createWebAudioBeep = () => {
      // Create a custom beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      let isPlaying = false;
      let intervalId: number | null = null;

      audioRef.current = {
        play: () => {
          if (isPlaying) return Promise.resolve();
          isPlaying = true;
          
          const playBeep = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          };

          playBeep();
          intervalId = window.setInterval(playBeep, 1000);
          return Promise.resolve();
        },
        pause: () => {
          isPlaying = false;
          if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
          }
        },
        currentTime: 0,
        loop: true
      } as any;
    };

    tryLoadAudio();

    const primeAudio = () => {
      if (audioPrimedRef.current || !audioRef.current) return;
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current && (audioRef.current.currentTime = 0);
        audioPrimedRef.current = true;
      }).catch(() => {
        // ignored – user may need another interaction
      });
    };

    window.addEventListener('pointerdown', primeAudio, { once: true });
    window.addEventListener('keydown', primeAudio, { once: true });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
      window.removeEventListener('pointerdown', primeAudio);
      window.removeEventListener('keydown', primeAudio);
    };
  }, []);

  // Query to monitor new pickup requests
  const { data: requests } = useQuery({
    queryKey: ['global-pickup-monitor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pickup_requests')
        .select(
          `
          id,
          order_id,
          customer_name,
          user_phone,
          final_price,
          created_at,
          device:devices!inner(
            model_name,
            brand:brands!inner(name)
          ),
          city:cities(name)
          `
        )
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Failed to fetch pickup requests for notifications:', error);
        throw error;
      }
      
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        customer_name: item.customer_name,
        user_phone: item.user_phone,
        final_price: item.final_price,
        created_at: item.created_at,
        device: item.device ? {
          model_name: item.device.model_name,
          brand: {
            name: item.device.brand?.name || 'Unknown'
          }
        } : null,
        city: item.city ? {
          name: item.city.name
        } : null
      }));
      
      return transformedData as PickupRequest[];
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const startBeepFallback = () => {
    if (beepIntervalRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const playBeep = () => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    };
    playBeep();
    beepIntervalRef.current = window.setInterval(playBeep, 1000);
  };

  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
  };

  const playAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          audioPrimedRef.current = true;
        })
        .catch(() => {
          startBeepFallback();
        });
    } else {
      startBeepFallback();
    }
  };

  // Watch for new requests
  useEffect(() => {
    if (!requests) return;

    if (prevRequestCountRef.current === null) {
      prevRequestCountRef.current = requests.length;
      return;
    }

    if (requests.length > prevRequestCountRef.current) {
      const latestRequest = requests[0];
      if (latestRequest?.id && lastAlertIdRef.current === latestRequest.id) {
        prevRequestCountRef.current = requests.length;
        return;
      }
      lastAlertIdRef.current = latestRequest?.id || null;
      if (lastAlertIdRef.current) {
        localStorage.setItem('admin_last_pickup_alert_id', lastAlertIdRef.current);
      }
      setNewOrderData(latestRequest);
      setNewOrderAlertOpen(true);

      playAlarmSound();
      
      prevRequestCountRef.current = requests.length;
    }
  }, [requests]);

  // Realtime listener for immediate alerts
  useEffect(() => {
    const channel = supabase
      .channel('admin-pickup-new')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pickup_requests' }, (payload) => {
        const record = payload.new;
        if (!record?.id) return;
        if (lastAlertIdRef.current === record.id) return;
        const enriched = transformRecord(record);
        lastAlertIdRef.current = record.id;
        localStorage.setItem('admin_last_pickup_alert_id', record.id);
        setNewOrderData(enriched);
        setNewOrderAlertOpen(true);
        playAlarmSound();
        prevRequestCountRef.current = (prevRequestCountRef.current || 0) + 1;
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stopAlarm = () => {
    stopAlarmSound();
    if (lastAlertIdRef.current) {
      localStorage.setItem('admin_last_pickup_alert_id', lastAlertIdRef.current);
    }
    setNewOrderAlertOpen(false);
  };

  return (
    <Dialog open={newOrderAlertOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] border-l-8 border-l-green-600 animate-in fade-in zoom-in duration-300 pointer-events-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-full animate-pulse">
              <BellRing className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              New Request Received!
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600">
            A new pickup request has just arrived. The alarm is ringing.
          </DialogDescription>
        </DialogHeader>
        
        {newOrderData && (
          <div className="bg-slate-50 p-4 rounded-lg space-y-3 border mt-2 shadow-sm">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-slate-500">Customer</span>
              <span className="font-bold text-lg text-slate-900">
                {newOrderData.customer_name}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-slate-500">Device</span>
              <span className="font-semibold text-blue-700">
                {newOrderData.device?.brand?.name} {newOrderData.device?.model_name}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-slate-500">Price Offered</span>
              <span className="font-bold text-xl text-green-600">
                ₹{Number(newOrderData.final_price || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">City</span>
              <span className="font-medium">{newOrderData.city?.name || 'N/A'}</span>
            </div>
            <div className="text-xs text-right text-slate-400 mt-2">
              Received: {format(new Date(newOrderData.created_at), 'hh:mm:ss a')}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 sm:justify-center">
          <Button 
            size="lg" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-12 shadow-lg hover:shadow-xl transition-all"
            onClick={stopAlarm}
          >
            <CheckCircle className="mr-2 h-6 w-6" />
            Accept & Stop Alarm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GlobalPickupNotifications;
