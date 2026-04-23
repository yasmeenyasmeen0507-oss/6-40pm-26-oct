import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  MapPin,
  Smartphone,
  IndianRupee,
  Clock,
  CheckCircle,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { format } from 'date-fns';

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

interface Props {
  request: NewPickupRequest | null;
  onAccept: () => void;
  isAlarmPlaying: boolean;
}

export function NewPickupNotification({ request, onAccept, isAlarmPlaying }: Props) {
  if (!request) return null;

  return (
    <AnimatePresence>
      <Dialog open={!!request} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-[500px] border-4 border-red-500 shadow-2xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
              🚨 NEW PICKUP REQUEST
            </Badge>
          </motion.div>

          <DialogHeader className="mt-4">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {isAlarmPlaying && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Volume2 className="w-6 h-6 text-red-600" />
                </motion.div>
              )}
              New Customer Request
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Received: {format(new Date(request.created_at), 'MMM dd, yyyy HH:mm:ss')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Customer Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Name:</span>
                  <span className="font-semibold">{request.customer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Phone:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      {request.verified_phone || request.user_phone}
                    </span>
                    {request.is_phone_verified && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                {request.city && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> City:
                    </span>
                    <span className="font-semibold">{request.city.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                Device Details
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Model:</span>
                <span className="font-semibold">
                  {request.device?.brand.name} {request.device?.model_name}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                Offer Price
              </h3>
              <div className="text-3xl font-bold text-green-700">
                ₹{request.final_price.toLocaleString('en-IN')}
              </div>
            </div>

            {request.pickup_date && (
              <div className="bg-slate-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600">Pickup:</span>
                  <span className="font-semibold">
                    {format(new Date(request.pickup_date), 'MMM dd, yyyy')}
                    {request.pickup_time && ` • ${request.pickup_time}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-full"
            >
              <Button
                onClick={onAccept}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept & Stop Alarm
              </Button>
            </motion.div>
          </DialogFooter>

          <p className="text-xs text-center text-slate-400 mt-2">
            Request ID: {request.id.slice(0, 8)}
          </p>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
