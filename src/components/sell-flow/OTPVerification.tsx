import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult 
} from 'firebase/auth';
import { auth } from '@/firebase';
import { supabase } from '@/lib/supabase';

interface Props {
  onVerify: (phoneNumber: string, leadId: string) => void;
}

// Window type declaration
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

const OTPVerification = ({ onVerify }: Props) => {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

  // Extract flow state from URL params
  const flowState = {
    category: searchParams.get("category"),
    brandId: searchParams.get("brandId"),
    brandName: searchParams.get("brandName"),
    deviceId: searchParams.get("deviceId"),
    deviceName: searchParams.get("deviceName"),
    cityId: searchParams.get("cityId"),
    cityName: searchParams.get("cityName"),
    variantId: searchParams.get("variantId"),
    storageGb: searchParams.get("storageGb"),
    basePrice: parseFloat(searchParams.get("basePrice") || "0"),
    finalPrice: parseFloat(searchParams.get("finalPrice") || "0"),
    condition: searchParams.get("condition"),
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // New useEffect for OTP validation
  useEffect(() => {
    // Check if OTP is complete (all 6 digits filled)
    const isOtpComplete = otp.every((digit) => digit !== "");
    if (isOtpComplete) {
      // Add a small delay to ensure state is updated
      const timer = setTimeout(() => {
        handleVerifyOTP();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp]); // Only run when OTP changes

  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            toast({
              title: "reCAPTCHA Expired",
              description: "Please try again",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  // Format phone to E.164
  const formatPhone = (phone: string) => `+91${phone}`;

  // Send OTP via Firebase Auth
  const handleSendOTP = async () => {
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

    setIsSending(true);

    try {
      const formattedPhone = formatPhone(phoneNumber);
      
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      setConfirmationResult(confirmation);
      window.confirmationResult = confirmation;

      // Store temporarily
      localStorage.setItem("pending_verification_phone", formattedPhone);
      localStorage.setItem("pending_customer_name", customerName);
      localStorage.setItem("verification_timestamp", new Date().toISOString());

      setOtpSent(true);
      setTimer(60);

      toast({
        title: "OTP Sent! 📱",
        description: `Verification code sent to ${formattedPhone}`,
      });
    } catch (error: any) {
      console.error("❌ Send OTP failed:", error);
      toast({
        title: "Failed to Send OTP",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined as any;
      }
    } finally {
      setIsSending(false);
    }
  };

  // Verify OTP with Firebase
  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    // Add additional validation
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!confirmationResult) {
      toast({
        title: "Error",
        description: "Please request OTP first",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple verification attempts
    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const formattedPhone = formatPhone(phoneNumber);

      // Step 1: Verify with Firebase
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;

      // Step 2: Save lead to the 'leads' table
      const leadData: any = {
        customer_name: customerName,
        phone_number: formattedPhone, 
        verified_phone: formattedPhone,
        is_phone_verified: true,
        lead_status: 'otp-verified',
      };
      
      // Add optional flow state if available
      if (flowState.deviceId) leadData.device_id = flowState.deviceId;
      if (flowState.variantId) leadData.variant_id = flowState.variantId;
      if (flowState.cityId) leadData.city_id = flowState.cityId;
      if (flowState.condition) leadData.condition = flowState.condition;
      if (flowState.finalPrice) leadData.final_price = flowState.finalPrice;

      // --- TARGETING 'leads' TABLE ---
      const { data: savedLead, error: dbError } = await supabase
        .from('leads') 
        .insert(leadData)
        .select()
        .single();
      // ---------------------------------

      if (dbError) {
        console.error("❌ Database error:", dbError);
        toast({
          title: "Verification Successful",
          description: `Phone verified but couldn't save lead. Error code: ${dbError.code}. Please contact support.`,
          variant: "destructive",
        });
        return;
      }

      // Step 3: Store in localStorage
      localStorage.setItem("verified_phone", formattedPhone);
      localStorage.setItem("customer_name", customerName);
      localStorage.setItem("phone_verified_at", new Date().toISOString());
      localStorage.setItem("is_phone_verified", "true");
      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("lead_id", savedLead.id);

      // Clear pending
      localStorage.removeItem("pending_verification_phone");
      localStorage.removeItem("pending_customer_name");

      toast({
        title: "Success! ✅",
        description: "Phone verified  successfully",
      });

      // Step 4: Navigate with lead ID
      setTimeout(() => {
        onVerify(formattedPhone, savedLead.id);
      }, 1000);

    } catch (error: any) {
      console.error("❌ Verification failed:", error);
      
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();

      toast({
        title: "Verification Failed",
        description: error?.message || "Please check your OTP and try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle OTP input with auto-focus
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);

    // Focus last input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Verify Your <span style={{ color: "#4169E1" }}>Number</span>
        </h2>
        <p className="text-muted-foreground">
          We'll send you an OTP to verify your phone number
        </p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#4169E1]" />
            Phone Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Input */}
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

          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-4 bg-muted rounded-lg border">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                maxLength={10}
                disabled={otpSent}
                className="flex-1 focus:ring-[#4169E1] focus:border-[#4169E1]"
              />
            </div>
          </div>

          {/* Send OTP Button */}
          {!otpSent ? (
            <Button
              onClick={handleSendOTP}
              className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-white"
              size="lg"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp-0" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4169E1]" />
                  Enter OTP
                </Label>
                <div
                  className="flex justify-center gap-2"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold focus:ring-[#4169E1] focus:border-[#4169E1]"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-white"
                size="lg"
                disabled={isVerifying || otp.some((d) => !d)}
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              {/* Change Number */}
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp(["", "", "", "", "", ""]);
                  setTimer(0);
                  setConfirmationResult(null);
                  localStorage.removeItem("pending_verification_phone");
                  localStorage.removeItem("pending_customer_name");
                  if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = undefined as any;
                  }
                }}
                className="w-full text-center text-sm text-[#4169E1] hover:underline"
              >
                ← Change Phone Number
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in{" "}
                    <span className="font-semibold text-[#4169E1]">
                      {timer}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp(["", "", "", "", "", ""]);
                      setConfirmationResult(null);
                      if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.clear();
                        window.recaptchaVerifier = undefined as any;
                      }
                      handleSendOTP();
                    }}
                    disabled={isSending}
                    className="text-sm text-[#4169E1] hover:underline disabled:text-muted-foreground"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-100">
        <AlertCircle className="w-4 h-4 text-[#4169E1] mt-0.5 flex-shrink-0" />
        <p>
          Your number is safe with us. We'll only use it for pickup
          coordination.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
