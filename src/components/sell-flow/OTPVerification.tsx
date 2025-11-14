import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/firebase";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onVerify: (phoneNumber: string, leadId: string) => void;
  flowState?: {
    category: string | null;
    brandId: string | null;
    brandName: string | null;
    deviceId: string | null;
    deviceName: string | null;
    releaseDate: string | null;
    cityId: string | null;
    cityName: string | null;
    variantId: string | null;
    storageGb: number | null;
    basePrice: number | null;
    finalPrice: number;
    condition?: any;
    phoneNumber?: string | null;
  };
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const OTPVerification = ({ onVerify, flowState }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

  // Debug log on mount
  useEffect(() => {
    console.log("🔍 OTPVerification mounted");
    console.log("📊 Incoming flowState prop:", flowState);
    try {
      const stored = sessionStorage.getItem("flowState");
      if (stored) {
        console.log("📦 SessionStorage flowState:", JSON.parse(stored));
      } else {
        console.log("⚠️ No flowState in sessionStorage");
      }
    } catch (e) {
      console.warn("Error reading sessionStorage:", e);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    const isOtpComplete = otp.every((digit) => digit !== "");
    if (isOtpComplete && !isVerifying && confirmationResult) {
      const timer = setTimeout(() => {
        handleVerifyOTP();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp]);

  const cleanupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        delete window.recaptchaVerifier;
      }
      const oldContainer = document.getElementById("recaptcha-container");
      if (oldContainer) oldContainer.remove();
      const newContainer = document.createElement("div");
      newContainer.id = "recaptcha-container";
      const parent = document.querySelector(".max-w-md");
      if (parent) parent.insertBefore(newContainer, parent.firstChild);
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge && badge.parentElement) badge.parentElement.style.visibility = "hidden";
    } catch (error) {
      console.error("recaptcha cleanup error", error);
    }
  };

  const setupRecaptcha = async () => {
    try {
      cleanupRecaptcha();
      await new Promise((r) => setTimeout(r, 300));
      const container = document.getElementById("recaptcha-container");
      if (!container) throw new Error("reCAPTCHA container not found");
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          cleanupRecaptcha();
          toast({ title: "reCAPTCHA Expired", description: "Please try again", variant: "destructive" });
        },
      });
      window.recaptchaVerifier = verifier;
      return verifier;
    } catch (error) {
      cleanupRecaptcha();
      throw error;
    }
  };

  const formatPhone = (phone: string) => `+91${phone}`;

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!customerName.trim()) {
      toast({ title: "Name Required", description: "Please enter your name", variant: "destructive" });
      return;
    }

    setIsSending(true);
    try {
      const formattedPhone = formatPhone(phoneNumber);
      const appVerifier = await setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      window.confirmationResult = confirmation;
      localStorage.setItem("pending_verification_phone", formattedPhone);
      localStorage.setItem("pending_customer_name", customerName);
      localStorage.setItem("verification_timestamp", new Date().toISOString());
      setOtpSent(true);
      setTimer(60);
      toast({ title: "OTP Sent! 📱", description: `Verification code sent to ${formattedPhone}` });
    } catch (error: any) {
      console.error("Send OTP failed:", error);
      let errorMessage = "Please try again";
      if (error.code === "auth/too-many-requests") errorMessage = "Too many attempts. Please try again later.";
      if (error.code === "auth/invalid-phone-number") errorMessage = "Invalid phone number format";
      toast({ title: "Failed to Send OTP", description: errorMessage, variant: "destructive" });
      cleanupRecaptcha();
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (!otpCode || otpCode.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit OTP", variant: "destructive" });
      return;
    }
    if (!confirmationResult) {
      toast({ title: "Error", description: "Please request OTP first", variant: "destructive" });
      return;
    }
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      const formattedPhone = formatPhone(phoneNumber);
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;

      // Get effective flowState (prop or sessionStorage fallback)
      const effectiveFlowState = (() => {
        if (flowState) return flowState;
        try {
          const stored = sessionStorage.getItem("flowState");
          if (stored) return JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse sessionStorage flowState", e);
        }
        return null;
      })();

      console.log("🎯 Using effectiveFlowState:", effectiveFlowState);
      console.log("🔍 Condition object:", effectiveFlowState?.condition);

      // Build lead data with proper condition field extraction
      const leadData: any = {
        customer_name: customerName,
        phone_number: formattedPhone,
        verified_phone: formattedPhone,
        is_phone_verified: true,
        lead_status: "new",
        converted_to_pickup: false,
        final_price: typeof effectiveFlowState?.finalPrice === "number"
          ? effectiveFlowState.finalPrice
          : effectiveFlowState?.finalPrice
          ? Number(effectiveFlowState.finalPrice)
          : null,
        device_id: effectiveFlowState?.deviceId ?? null,
        variant_id: effectiveFlowState?.variantId ?? null,
        city_id: effectiveFlowState?.cityId ?? null,
      };

      // CRITICAL FIX: Properly extract condition fields
      if (effectiveFlowState?.condition) {
        const cond = effectiveFlowState.condition;
        console.log("📋 Extracting condition fields:", cond);

        // Add each field individually (safer than spreading)
        if (typeof cond.can_make_calls === "boolean") {
          leadData.can_make_calls = cond.can_make_calls;
        }
        if (typeof cond.is_touch_working === "boolean") {
          leadData.is_touch_working = cond.is_touch_working;
        }
        if (typeof cond.is_screen_original === "boolean") {
          leadData.is_screen_original = cond.is_screen_original;
        }
        if (typeof cond.is_battery_healthy === "boolean") {
          leadData.is_battery_healthy = cond.is_battery_healthy;
        }
        if (cond.overall_condition) {
          leadData.overall_condition = cond.overall_condition;
        }
        if (cond.age_group) {
          leadData.age_group = cond.age_group;
        }
        if (typeof cond.has_charger === "boolean") {
          leadData.has_charger = cond.has_charger;
        }
        if (typeof cond.has_box === "boolean") {
          leadData.has_box = cond.has_box;
        }
        if (typeof cond.has_bill === "boolean") {
          leadData.has_bill = cond.has_bill;
        }

        console.log("✅ Condition fields added to leadData");
      } else {
        console.warn("⚠️ No condition object found in effectiveFlowState");
      }

      console.log("💾 Final lead payload to insert:", JSON.stringify(leadData, null, 2));

      const { data: savedLead, error: dbError } = await supabase
        .from("leads")
        .insert(leadData)
        .select()
        .single();

      if (dbError) {
        console.error("❌ Database error:", dbError);
        toast({ title: "Database Error", description: dbError.message ?? "Failed to save lead", variant: "destructive" });
        return;
      }

      console.log("✅ Lead saved successfully:", savedLead);

      localStorage.setItem("verified_phone", formattedPhone);
      localStorage.setItem("customer_name", customerName);
      localStorage.setItem("phone_verified_at", new Date().toISOString());
      localStorage.setItem("is_phone_verified", "true");
      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("lead_id", savedLead.id);
      localStorage.removeItem("pending_verification_phone");
      localStorage.removeItem("pending_customer_name");

      toast({ title: "Success! ✅", description: "Phone verified successfully" });
      cleanupRecaptcha();

      setTimeout(() => onVerify(formattedPhone, savedLead.id), 800);
    } catch (error: any) {
      console.error("❌ Verification failed:", error);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
      let errorMessage = "Please check your OTP and try again";
      if (error.code === "auth/invalid-verification-code") errorMessage = "Invalid OTP. Please check and try again.";
      if (error.code === "auth/code-expired") errorMessage = "OTP has expired. Please request a new one.";
      toast({ title: "Verification Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((c, i) => { if (i < 6) newOtp[i] = c; });
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length - 1, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const handleResetOTP = () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setTimer(0);
    setConfirmationResult(null);
    setIsVerifying(false);
    localStorage.removeItem("pending_verification_phone");
    localStorage.removeItem("pending_customer_name");
    cleanupRecaptcha();
  };

  const handleResendOTP = async () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setTimer(0);
    setConfirmationResult(null);
    cleanupRecaptcha();
    await new Promise((r) => setTimeout(r, 500));
    await handleSendOTP();
  };

  useEffect(() => {
    return () => cleanupRecaptcha();
  }, []);

  return (
    <div className="max-w-md mx-auto animate-fade-in-up">
      <div id="recaptcha-container"></div>

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
              <div className="space-y-2">
                <Label htmlFor="otp-0" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4169E1]" />
                  Enter OTP
                </Label>
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                <p className="text-xs text-muted-foreground text-center">OTP sent to +91 {phoneNumber}</p>
              </div>

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

              <button
                onClick={handleResetOTP}
                className="w-full text-center text-sm text-[#4169E1] hover:underline"
                disabled={isVerifying || isSending}
              >
                ← Change Phone Number
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in <span className="font-semibold text-[#4169E1]">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={isSending || isVerifying}
                    className="text-sm text-[#4169E1] hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {isSending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-100">
        <AlertCircle className="w-4 h-4 text-[#4169E1] mt-0.5 flex-shrink-0" />
        <p>Your number is safe with us. We'll only use it for pickup coordination.</p>
      </div>
    </div>
  );
};

export default OTPVerification;