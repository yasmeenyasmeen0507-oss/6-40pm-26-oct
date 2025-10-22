// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IndianRupee, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  variantId: string;
  basePrice: number;
  deviceName: string;
  releaseDate: string;
  onComplete: (
    condition: {
      devicePowersOn: boolean;
      displayCondition: string;
      bodyCondition: string;
      ageGroup: string;
      hasCharger: boolean;
      hasBill: boolean;
      hasBox: boolean;
    },
    finalPrice: number
  ) => void;
}

const ConditionQuestions = ({ variantId, basePrice, deviceName, releaseDate, onComplete }: Props) => {
  const [devicePowersOn, setDevicePowersOn] = useState(true);
  const [displayCondition, setDisplayCondition] = useState("excellent");
  const [bodyCondition, setBodyCondition] = useState("excellent");
  const [hasCharger, setHasCharger] = useState(false);
  const [hasBill, setHasBill] = useState(false);
  const [hasBox, setHasBox] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [warrantyStatus, setWarrantyStatus] = useState("");

  const getMonthsSinceLaunch = () => {
    if (!releaseDate) return 0;
    const launch = new Date(releaseDate);
    const now = new Date();
    const months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth());
    return Math.max(0, months);
  };

  const getAgeGroup = (months: number): string => {
    if (months <= 3) return "0-3";
    if (months <= 6) return "3-6";
    if (months <= 11) return "6-11";
    return "12+";
  };

  const monthsSinceLaunch = getMonthsSinceLaunch();
  const ageGroup = getAgeGroup(monthsSinceLaunch);

  useEffect(() => {
    fetchWarrantyPrice();
  }, [variantId]);

  const fetchWarrantyPrice = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("warranty_prices")
        .select("*")
        .eq("variant_id", variantId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching warranty prices:", error);
        setFinalPrice(basePrice);
        setWarrantyStatus("Unknown");
        return;
      }

      if (!data) {
        console.warn("No warranty prices found for variant:", variantId);
        setFinalPrice(basePrice);
        setWarrantyStatus("Unknown");
        return;
      }

      const months = monthsSinceLaunch;
      let price = 0;
      let status = "";

      if (months <= 3) {
        price = data.price_0_3_months;
        status = "0-3 months (Like New)";
      } else if (months <= 6) {
        price = data.price_3_6_months;
        status = "3-6 months (Very Good)";
      } else if (months <= 11) {
        price = data.price_6_11_months;
        status = "6-11 months (Under Warranty)";
      } else {
        price = data.price_11_plus_months;
        status = "11+ months (Out of Warranty)";
      }

      setFinalPrice(price);
      setWarrantyStatus(status);
    } catch (err) {
      console.error("Error in fetchWarrantyPrice:", err);
      setFinalPrice(basePrice);
      setWarrantyStatus("Unknown");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete(
      {
        devicePowersOn,
        displayCondition,
        bodyCondition,
        ageGroup,
        hasCharger,
        hasBill,
        hasBox,
      },
      finalPrice
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Tell Us About Your {deviceName}</h2>
        <p className="text-muted-foreground">Answer these questions for assessment purposes during pickup</p>
      </div>

      <Card className="mb-8 border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Device Age: {monthsSinceLaunch} months</span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Warranty Status</p>
              <p className="text-lg font-semibold text-primary">{warrantyStatus}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Final Offer Price</p>
              <div className="flex items-center justify-center gap-2">
                <IndianRupee className="w-8 h-8 text-primary/40" />
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              This price is based on your device's warranty period
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Does your device power on?</CardTitle>
              <p className="text-sm text-muted-foreground">For assessment purposes only</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={devicePowersOn ? "yes" : "no"} onValueChange={(v) => setDevicePowersOn(v === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="power-yes" />
                  <Label htmlFor="power-yes" className="cursor-pointer">Yes, it powers on normally</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="power-no" />
                  <Label htmlFor="power-no" className="cursor-pointer">No, it doesn't power on</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Condition</CardTitle>
              <p className="text-sm text-muted-foreground">For assessment purposes only</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={displayCondition} onValueChange={setDisplayCondition}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="display-excellent" />
                  <Label htmlFor="display-excellent" className="cursor-pointer">Excellent - No scratches or marks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="display-good" />
                  <Label htmlFor="display-good" className="cursor-pointer">Good - Minor scratches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="display-fair" />
                  <Label htmlFor="display-fair" className="cursor-pointer">Fair - Visible scratches</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="display-poor" />
                  <Label htmlFor="display-poor" className="cursor-pointer">Poor - Cracked or damaged</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Body Condition</CardTitle>
              <p className="text-sm text-muted-foreground">For assessment purposes only</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={bodyCondition} onValueChange={setBodyCondition}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="body-excellent" />
                  <Label htmlFor="body-excellent" className="cursor-pointer">Excellent - Like new</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="body-good" />
                  <Label htmlFor="body-good" className="cursor-pointer">Good - Minor wear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="body-fair" />
                  <Label htmlFor="body-fair" className="cursor-pointer">Fair - Visible wear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="body-poor" />
                  <Label htmlFor="body-poor" className="cursor-pointer">Poor - Significant damage</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accessories Available</CardTitle>
              <p className="text-sm text-muted-foreground">For assessment purposes only</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="charger" checked={hasCharger} onCheckedChange={(checked) => setHasCharger(checked as boolean)} />
                <Label htmlFor="charger" className="cursor-pointer">Original Charger</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bill" checked={hasBill} onCheckedChange={(checked) => setHasBill(checked as boolean)} />
                <Label htmlFor="bill" className="cursor-pointer">Original Bill</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="box" checked={hasBox} onCheckedChange={(checked) => setHasBox(checked as boolean)} />
                <Label htmlFor="box" className="cursor-pointer">Original Box</Label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleComplete} className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-6 text-lg">
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default ConditionQuestions;
