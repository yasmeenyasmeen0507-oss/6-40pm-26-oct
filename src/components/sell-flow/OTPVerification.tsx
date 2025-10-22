import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onVerify: (phoneNumber: string) => void;
}

const OTPVerification = ({ onVerify }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
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

    // Simulate OTP send
    setOtpSent(true);
    toast({
      title: "OTP Sent!",
      description: `Verification code sent to +91 ${phoneNumber}`,
    });
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      toast({
        title: "Verified!",
        description: "Phone number verified successfully",
      });
      onVerify(phoneNumber);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Verify Your Number</h2>
        <p className="text-muted-foreground">We'll send you an OTP to verify your phone number</p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Phone Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                className="flex-1"
              />
            </div>
          </div>

          {!otpSent ? (
            <Button
              onClick={handleSendOTP}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
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
                  <Lock className="w-4 h-4" />
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                size="lg"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className="w-full text-center text-sm text-primary hover:underline"
              >
                Change Phone Number
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
