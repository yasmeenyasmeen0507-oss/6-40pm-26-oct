import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePickupPartnerAuth } from '@/contexts/PickupPartnerAuthContext';

export function ProtectedPickupPartnerRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = usePickupPartnerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/pickup-partner/login" replace />;
  }

  return <>{children}</>;
}
