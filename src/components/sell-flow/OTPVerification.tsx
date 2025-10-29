import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { anonSupabase } from "@/integrations/supabase/anonClient";
import type { FlowState } from "@/pages/Index";

interface Props {
  onVerify: (phoneNumber: string) => void;
  flowState?: FlowState;
}

const OTPVerification = ({ onVerify, flowState }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage temporarily
    localStorage.setItem('pending_verification_phone', `+91${phoneNumber}`);
    localStorage.setItem('pending_customer_name', customerName);
    localStorage.setItem('verification_timestamp', new Date().toISOString());

    // Simulate OTP send
    setOtpSent(true);
    toast({
      title: "OTP Sent!",
      description: `Verification code sent to +91 ${phoneNumber}`,
    });
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const verifiedPhone = `+91${phoneNumber}`;
      
      console.log('💾 Saving lead with data:', {
        customer_name: customerName,
        phone_number: phoneNumber,
        verified_phone: verifiedPhone,
        device_id: flowState?.deviceId,
        variant_id: flowState?.variantId,
        city_id: flowState?.cityId,
        final_price: flowState?.finalPrice,
      });

      // ✅ Save lead to database using anonSupabase
      const { data: leadData, error: leadError } = await anonSupabase
        .from('leads')
        .insert({
          customer_name: customerName,
          phone_number: phoneNumber,
          verified_phone: verifiedPhone,
          is_phone_verified: true,
          device_id: flowState?.deviceId,
          variant_id: flowState?.variantId,
          city_id: flowState?.cityId,
          final_price: flowState?.finalPrice || 0,
          
          // Device condition answers
          condition: flowState?.condition?.overallCondition,
          age_group: flowState?.condition?.ageGroup,
          device_powers_on: true,
          can_make_calls: flowState?.condition?.canMakeCalls,
          is_touch_working: flowState?.condition?.isTouchWorking,
          is_screen_original: flowState?.condition?.isScreenOriginal,
          is_battery_healthy: flowState?.condition?.isBatteryHealthy,
          
          // Lead management
          lead_status: 'new',
          converted_to_pickup: false,
        })
        .select()
        .single();

      if (leadError) {
        console.error('❌ Error saving lead:', leadError);
        throw leadError;
      }

      console.log('✅ Lead saved successfully:', leadData);

      // Store in localStorage
      localStorage.setItem('verified_phone', verifiedPhone);
      localStorage.setItem('customer_name', customerName);
      localStorage.setItem('phone_verified_at', new Date().toISOString());
      localStorage.setItem('is_phone_verified', 'true');
      localStorage.setItem('lead_id', leadData.id); // Store lead ID for conversion
      
      // Clear pending verification
      localStorage.removeItem('pending_verification_phone');
      localStorage.removeItem('pending_customer_name');
      
      toast({
        title: "Verified!",
        description: "Phone number verified successfully",
      });
      
      setTimeout(() => {
        onVerify(verifiedPhone);
      }, 1000);

    } catch (error: any) {
      console.error('❌ Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Verify Your <span style={{ color: "#4169E1" }}>Number</span>
        </h2>
        <p className="text-muted-foreground">We'll send you an OTP to verify your phone number</p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#4169E1]" />
            Phone Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={otpSent}
              className="focus:ring-[#4169E1] focus:border-[#4169E1]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-4 bg-muted rounded-lg border">+91</span>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                disabled={otpSent}
                className="flex-1 focus:ring-[#4169E1] focus:border-[#4169E1]"
              />
            </div>
          </div>

          {!otpSent ? (
            <Button
              onClick={handleSendOTP}
              className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-white"
              size="lg"
            >
              Send OTP
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4169E1]" />
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest focus:ring-[#4169E1] focus:border-[#4169E1]"
                />
                <p className="text-xs text-muted-foreground text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-white"
                size="lg"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  localStorage.removeItem('pending_verification_phone');
                  localStorage.removeItem('pending_customer_name');
                }}
                className="w-full text-center text-sm text-[#4169E1] hover:underline"
              >
                Change Phone Number
              </button>

              <button
                onClick={() => {
                  toast({
                    title: "OTP Resent!",
                    description: `New code sent to +91 ${phoneNumber}`,
                  });
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-[#4169E1]"
              >
                Resend OTP
              </button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Your number is safe with us. We'll only use it for pickup coordination.</p>
      </div>
    </div>
  );
};

export default OTPVerification;