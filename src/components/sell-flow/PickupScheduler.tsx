// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, User, Home, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FlowState } from "@/pages/Index";

interface Props {
  flowState: FlowState;
}

const PickupScheduler = ({ flowState }: Props) => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");  // ✅ NEW
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // ✅ NEW: Real-time email validation
  const validateEmail = (value: string) => {
    setEmail(value);
    
    if (!value) {
      setEmailError("");
      return;
    }

    // Check if email contains @gmail.com
    if (!value.includes("@gmail.com")) {
      setEmailError("Please enter a valid Gmail address (@gmail.com)");
      return;
    }

    // Check basic email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid Gmail format");
      return;
    }

    // Valid email
    setEmailError("");
  };

  const handleSubmit = async () => {
    if (!customerName || !email || !address || !pincode || !pickupDate || !pickupTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // ✅ Check for email errors before submission
    if (emailError || !email.includes("@gmail.com")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Gmail address",
        variant: "destructive",
      });
      return;
    }

    if (pincode.length !== 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("pickup_requests")
        .insert({
          user_phone: flowState.phoneNumber!,
          device_id: flowState.deviceId!,
          variant_id: flowState.variantId!,
          city_id: flowState.cityId!,
          condition: "good" as any,
          age_group: flowState.condition!.ageGroup as any,
          
          has_charger: flowState.condition!.hasCharger,
          has_bill: flowState.condition!.hasBill,
          has_box: flowState.condition!.hasBox,
          
          device_powers_on: true,
          display_condition: "good" as any,
          body_condition: "good" as any,
          
          can_make_calls: flowState.condition!.canMakeCalls,
          is_touch_working: flowState.condition!.isTouchWorking,
          is_screen_original: flowState.condition!.isScreenOriginal,
          is_battery_healthy: flowState.condition!.isBatteryHealthy,
          
          overall_condition: flowState.condition!.overallCondition,
          
          final_price: flowState.finalPrice,
          customer_name: customerName,
          email: email,
          address: address,
          pincode: pincode,
          pickup_date: format(pickupDate, "yyyy-MM-dd"),
          pickup_time: pickupTime,
          status: "pending",
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Your pickup has been scheduled successfully",
      });
    } catch (error) {
      console.error("Error submitting pickup request:", error);
      toast({
        title: "Error",
        description: "Failed to schedule pickup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary to-secondary">
          <CheckCircle2 className="w-16 h-16 text-white" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gradient">Pickup Scheduled!</h2>
          <p className="text-xl text-muted-foreground">
            Your device pickup has been successfully scheduled
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pickup Date:</span>
              <span className="font-semibold">{pickupDate ? format(pickupDate, "PPP") : ""}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pickup Time:</span>
              <span className="font-semibold">{pickupTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expected Payment:</span>
              <span className="text-2xl font-bold text-primary">₹{flowState.finalPrice?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Confirmation email sent to {email}
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Our executive will contact you before pickup
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Please keep your device and documents ready
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Payment will be made immediately after verification
          </p>
        </div>
      </motion.div>
    );
  }

  const timeSlots = [
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];

  // ✅ Determine email input border color
  const getEmailBorderClass = () => {
    if (!email) return "";
    if (emailError) return "border-red-500 focus-visible:ring-red-500";
    return "border-green-500 focus-visible:ring-green-500";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gradient">Schedule Your Pickup</h2>
        <p className="text-muted-foreground">
          We'll collect your device and pay you instantly after verification
        </p>
        <div className="text-2xl font-bold text-primary">
          Offer Price: ₹{flowState.finalPrice?.toLocaleString()}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* ✅ Email Field with Validation */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Gmail Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                className={getEmailBorderClass()}
              />
              {email && !emailError && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {emailError && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {emailError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </p>
            )}
            {email && !emailError && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Valid Gmail address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Pickup Address
            </Label>
            <Input
              id="address"
              placeholder="Enter complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pincode
            </Label>
            <Input
              id="pincode"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Pickup Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                      return date < today || date > maxDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white"
            onClick={handleSubmit}
            disabled={isSubmitting || !!emailError || !email}
          >
            {isSubmitting ? "Scheduling..." : "Confirm Pickup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PickupScheduler;