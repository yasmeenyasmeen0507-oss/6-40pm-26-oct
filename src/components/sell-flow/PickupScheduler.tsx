// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, User, Home, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FlowState } from "@/pages/Index";

interface Props {
  flowState: FlowState;
}

const PickupScheduler = ({ flowState }: Props) => {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!customerName || !address || !pincode || !pickupDate || !pickupTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
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
      // @ts-expect-error - Supabase types are regenerating after migration
      const { error } = await supabase
        .from("pickup_requests")
        .insert({
        user_phone: flowState.phoneNumber!,
        device_id: flowState.deviceId!,
        variant_id: flowState.variantId!,
        city_id: flowState.cityId!,
        condition: flowState.condition!.displayCondition as any,
        age_group: flowState.condition!.ageGroup as any,
        has_charger: flowState.condition!.hasCharger,
        has_bill: flowState.condition!.hasBill,
        has_box: flowState.condition!.hasBox,
        device_powers_on: flowState.condition!.devicePowersOn,
        display_condition: flowState.condition!.displayCondition as any,
        body_condition: flowState.condition!.bodyCondition as any,
        final_price: flowState.finalPrice,
        customer_name: customerName,
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
        <div>
          <h1 className="text-4xl font-bold mb-4">All Set! 🎉</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your pickup has been scheduled for {pickupDate && format(pickupDate, "PPP")} at {pickupTime}
          </p>
        </div>
        <Card className="text-left">
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device:</span>
              <span className="font-semibold">{flowState.deviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage:</span>
              <span className="font-semibold">{flowState.storageGb}GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City:</span>
              <span className="font-semibold">{flowState.cityName}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Final Price:</span>
              <span className="text-primary">₹{flowState.finalPrice.toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground">
          We'll call you on <span className="font-semibold">+91 {flowState.phoneNumber}</span> before pickup
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Schedule Your Pickup</h2>
        <p className="text-muted-foreground">Tell us when and where to pick up your device</p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardContent className="p-6 space-y-6">
          {/* Name */}
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

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <Label htmlFor="pincode" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pincode
            </Label>
            <Input
              id="pincode"
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Pickup Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {pickupDate ? format(pickupDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Pickup Time</Label>
            <Select value={pickupTime} onValueChange={setPickupTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00-12:00">9:00 AM - 12:00 PM</SelectItem>
                <SelectItem value="12:00-15:00">12:00 PM - 3:00 PM</SelectItem>
                <SelectItem value="15:00-18:00">3:00 PM - 6:00 PM</SelectItem>
                <SelectItem value="18:00-21:00">6:00 PM - 9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white"
          >
            {isSubmitting ? "Scheduling..." : "Confirm Pickup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PickupScheduler;
