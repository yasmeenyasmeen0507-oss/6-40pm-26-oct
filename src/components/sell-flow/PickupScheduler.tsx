// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, User, Home, CheckCircle2, Mail, AlertCircle, Phone, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Props {
  flowState: any; // Can be FlowState or LaptopFlowState
}

const PickupScheduler = ({ flowState }: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  // ✅ Get verified phone and lead ID from localStorage
  const verifiedPhone = localStorage.getItem('verified_phone');
  const isPhoneVerified = localStorage.getItem('is_phone_verified') === 'true';
  const phoneVerifiedAt = localStorage.getItem('phone_verified_at');
  const leadId = localStorage.getItem('lead_id');
  const storedCustomerName = localStorage.getItem('customer_name');

  // Check if URL has success parameter on component mount
  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      setIsSuccess(true);
    }
  }, [searchParams]);

  // Pre-fill customer name if available
  useState(() => {
    if (storedCustomerName && !customerName) {
      setCustomerName(storedCustomerName);
    }
  }, []);

  // Email validation
  const validateEmail = (value: string) => {
    setEmail(value);
    
    if (!value) {
      setEmailError("");
      return;
    }

    if (!value.includes("@gmail.com")) {
      setEmailError("Please enter a valid Gmail address (@gmail.com)");
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid Gmail format");
      return;
    }

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
      // ✅ Build pickup request data based on category
      const pickupData: any = {
        // Phone Numbers
        user_phone: flowState.phoneNumber!, 
        verified_phone: verifiedPhone,
        is_phone_verified: isPhoneVerified,
        phone_verified_at: phoneVerifiedAt,
        
        // Device & Location
        device_id: flowState.deviceId!,
        variant_id: flowState.variantId!,
        city_id: flowState.cityId!,
        
        // Pricing & Customer Details
        final_price: flowState.finalPrice,
        customer_name: customerName,
        email: email,
        address: address,
        pincode: pincode,
        pickup_date: format(pickupDate, "yyyy-MM-dd"),
        pickup_time: pickupTime,
        status: "pending",
      };

      // ✅ Add mobile-specific fields (if category is phone)
      if (flowState.category === 'phone' || flowState.category === 'mobile') {
        pickupData.condition = "good" as any;
        pickupData.age_group = flowState.condition?.ageGroup as any;
        pickupData.has_charger = flowState.condition?.hasCharger;
        pickupData.has_bill = flowState.condition?.hasBill;
        pickupData.has_box = flowState.condition?.hasBox;
        pickupData.device_powers_on = true;
        pickupData.display_condition = "good" as any;
        pickupData.body_condition = "good" as any;
        pickupData.can_make_calls = flowState.condition?.canMakeCalls;
        pickupData.is_touch_working = flowState.condition?.isTouchWorking;
        pickupData.is_screen_original = flowState.condition?.isScreenOriginal;
        pickupData.is_battery_healthy = flowState.condition?.isBatteryHealthy;
        pickupData.overall_condition = flowState.condition?.overallCondition;
      }

      // ✅ Add laptop-specific fields (if category is laptop)
      if (flowState.category === 'laptop') {
        pickupData.age_range = flowState.ageRange; // '<1yr', '1-3yrs', '>3yrs'
        pickupData.condition = flowState.condition; // 'good', 'average', 'below_average'
      }

      // ✅ Step 1: Create pickup request
      const { data: pickupResponse, error: pickupError } = await supabase
        .from("pickup_requests")
        .insert(pickupData)
        .select()
        .single();

      if (pickupError) throw pickupError;

      console.log('✅ Pickup request created:', pickupResponse);

      // ✅ Step 2: Convert lead to pickup (if lead exists)
      if (leadId) {
        const { error: leadUpdateError } = await supabase
          .from('leads')
          .update({
            converted_to_pickup: true,
            pickup_request_id: pickupResponse.id,
            lead_status: 'converted',
          })
          .eq('id', leadId);

        if (leadUpdateError) {
          console.error('❌ Error converting lead:', leadUpdateError);
        } else {
          console.log('✅ Lead converted to pickup:', leadId);
        }
      }

      // ✅ Clear all localStorage data after successful submission
      localStorage.removeItem('verified_phone');
      localStorage.removeItem('customer_name');
      localStorage.removeItem('is_phone_verified');
      localStorage.removeItem('phone_verified_at');
      localStorage.removeItem('verification_timestamp');
      localStorage.removeItem('lead_id');

      // ✅ UPDATE URL WITH SUCCESS PARAMETER
      const currentPath = window.location.pathname;
      navigate(`${currentPath}?status=success&pickup_id=${pickupResponse.id}`, { replace: true });

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

  const handleDateSelect = (date: Date | undefined) => {
    setPickupDate(date);
    setCalendarOpen(false);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <div className="inline-flex p-6 rounded-full bg-[#4169E1]">
          <CheckCircle2 className="w-16 h-16 text-white" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-[#4169E1]">Pickup Scheduled!</h2>
          <p className="text-xl text-muted-foreground">
            Your device pickup has been successfully scheduled
          </p>
        </div>

        <Card className="border-2 border-[#4169E1]/20">
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
              <span className="text-muted-foreground">Contact Number:</span>
              <span className="font-semibold flex items-center gap-2">
                {verifiedPhone || flowState.phoneNumber}
                {isPhoneVerified && (
                  <Badge variant="outline" className="text-xs bg-[#4169E1]/10 text-[#4169E1] border-[#4169E1]/30">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expected Payment:</span>
              <span className="text-2xl font-bold text-[#4169E1]">₹{flowState.finalPrice?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4169E1]" />
            Confirmation sent to {verifiedPhone || flowState.phoneNumber}
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4169E1]" />
            Our executive will contact you before pickup
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4169E1]" />
            Please keep your device and documents ready
          </p>
          <p className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4169E1]" />
            Payment will be made immediately after verification
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.href = '/'}
          className="mt-6 border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white"
        >
          Return to Home
        </Button>
      </motion.div>
    );
  }

  const timeSlots = [
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];

  const getEmailBorderClass = () => {
    if (!email) return "";
    if (emailError) return "border-red-500 focus-visible:ring-red-500";
    return "border-[#4169E1] focus-visible:ring-[#4169E1]";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-[#4169E1]">Schedule Your Pickup</h2>
        <p className="text-muted-foreground">
          We'll collect your device and pay you instantly after verification
        </p>
        <div className="text-2xl font-bold text-[#4169E1]">
          Offer Price: ₹{flowState.finalPrice?.toLocaleString()}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {verifiedPhone && (
            <div className="bg-[#4169E1]/10 border border-[#4169E1]/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#4169E1]" />
                  <span className="text-sm font-medium text-[#4169E1]">Verified Contact Number</span>
                </div>
                <Badge variant="outline" className="bg-[#4169E1]/20 text-[#4169E1] border-[#4169E1]/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  OTP Verified
                </Badge>
              </div>
              <p className="text-lg font-semibold text-[#4169E1] mt-2">{verifiedPhone}</p>
              {phoneVerifiedAt && (
                <p className="text-xs text-[#4169E1]/70 mt-1">
                  Verified on {format(new Date(phoneVerifiedAt), "MMM dd, yyyy 'at' HH:mm")}
                </p>
              )}
            </div>
          )}

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
              className="focus:ring-[#4169E1] focus:border-[#4169E1]"
            />
          </div>

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
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4169E1]" />
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
              <p className="text-sm text-[#4169E1] flex items-center gap-1">
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
              className="focus:ring-[#4169E1] focus:border-[#4169E1]"
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
              className="focus:ring-[#4169E1] focus:border-[#4169E1]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Pickup Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal hover:bg-[#4169E1]/10 hover:border-[#4169E1]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                      return date < today || date > maxDate;
                    }}
                    initialFocus
                    className="[&_.rdp-day_selected]:bg-[#4169E1] [&_.rdp-day_selected]:text-white [&_.rdp-day_button:hover]:bg-[#4169E1]/10"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger className="hover:border-[#4169E1] focus:ring-[#4169E1]">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem 
                      key={slot} 
                      value={slot}
                      className="focus:bg-[#4169E1]/10 focus:text-[#4169E1]"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-white"
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