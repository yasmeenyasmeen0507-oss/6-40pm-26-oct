import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { usePickupPartnerAuth } from '@/contexts/PickupPartnerAuthContext';
import { Lock, Truck } from 'lucide-react';

export default function PickupPartnerLogin() {
  const { login, session } = usePickupPartnerAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('pickup');
  const [password, setPassword] = useState('1899');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/pickup-partner/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await login({ username, password, rememberMe });
      toast.success('Logged in as pickup partner');
      navigate('/pickup-partner/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Truck className="w-5 h-5 text-blue-400" />
            Pickup Partner Login
          </CardTitle>
          <p className="text-sm text-slate-400">Temporary access for assigned pickups.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="pickup"
                autoComplete="username"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="1899"
                  autoComplete="current-password"
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(val) => setRememberMe(Boolean(val))} />
              <label htmlFor="remember" className="text-sm text-slate-300">
                Keep me signed in
              </label>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Temporary credentials:</p>
              <p>Username: pickup</p>
              <p>Password: 1899</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
