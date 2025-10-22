import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, TrendingDown, Minus, IndianRupee } from "lucide-react";

interface Props {
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

const ConditionQuestions = ({ basePrice, deviceName, releaseDate, onComplete }: Props) => {
  const [devicePowersOn, setDevicePowersOn] = useState(true);
  const [displayCondition, setDisplayCondition] = useState("excellent");
  const [bodyCondition, setBodyCondition] = useState("excellent");
  const [hasCharger, setHasCharger] = useState(false);
  const [hasBill, setHasBill] = useState(false);
  const [hasBox, setHasBox] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(basePrice);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    base: number;
    power: number;
    display: number;
    body: number;
    age: number;
    accessories: number;
  }>({ base: basePrice, power: 0, display: 0, body: 0, age: 0, accessories: 0 });

  // Calculate months since launch
  const getMonthsSinceLaunch = () => {
    if (!releaseDate) return 0;
    const launch = new Date(releaseDate);
    const now = new Date();
    const months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth());
    return Math.max(0, months);
  };

  // Get age group for backward compatibility
  const getAgeGroup = (months: number): string => {
    if (months <= 3) return "0-3";
    if (months <= 6) return "3-6";
    if (months <= 11) return "6-11";
    return "12+";
  };

  const monthsSinceLaunch = getMonthsSinceLaunch();
  const ageGroup = getAgeGroup(monthsSinceLaunch);

  useEffect(() => {
    calculatePrice();
  }, [devicePowersOn, displayCondition, bodyCondition, hasCharger, hasBill, hasBox, releaseDate]);

  const calculatePrice = () => {
    let price = basePrice;
    const breakdown = { base: basePrice, power: 0, display: 0, body: 0, age: 0, accessories: 0 };

    // Power penalty - 50%
    if (!devicePowersOn) {
      const penalty = price * 0.5;
      breakdown.power = -penalty;
      price -= penalty;
    }

    // Display condition adjustment
    const displayPenalty: Record<string, number> = {
      excellent: 0,
      good: 0.05,
      fair: 0.15,
      poor: 0.3,
    };
    const displayDeduction = price * displayPenalty[displayCondition];
    breakdown.display = -displayDeduction;
    price -= displayDeduction;

    // Body condition adjustment
    const bodyPenalty: Record<string, number> = {
      excellent: 0,
      good: 0.03,
      fair: 0.1,
      poor: 0.2,
    };
    const bodyDeduction = price * bodyPenalty[bodyCondition];
    breakdown.body = -bodyDeduction;
    price -= bodyDeduction;

    // Dynamic age depreciation based on months since launch
    let ageDepreciationRate = 0;
    const months = monthsSinceLaunch;
    
    if (months <= 3) {
      ageDepreciationRate = 0; // 0-3 months: No depreciation
    } else if (months <= 6) {
      ageDepreciationRate = 0.08; // 3-6 months: 8%
    } else if (months <= 12) {
      ageDepreciationRate = 0.15; // 6-12 months: 15%
    } else if (months <= 24) {
      ageDepreciationRate = 0.25; // 12-24 months: 25%
    } else if (months <= 36) {
      ageDepreciationRate = 0.35; // 24-36 months: 35%
    } else {
      ageDepreciationRate = 0.45; // 36+ months: 45%
    }
    
    const ageDeduction = price * ageDepreciationRate;
    breakdown.age = -ageDeduction;
    price -= ageDeduction;

    // Accessories bonus - 2% each
    let accessoryBonus = 0;
    if (hasCharger) accessoryBonus += price * 0.02;
    if (hasBill) accessoryBonus += price * 0.02;
    if (hasBox) accessoryBonus += price * 0.02;
    breakdown.accessories = accessoryBonus;
    price += accessoryBonus;

    setCalculatedPrice(Math.round(price));
    setPriceBreakdown(breakdown);
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
      calculatedPrice
    );
  };

  const priceDiff = calculatedPrice - basePrice;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Tell Us About Your {deviceName}</h2>
        <p className="text-muted-foreground">Answer these questions to get accurate valuation</p>
      </div>

      {/* Live Price Display */}
      <Card className="mb-8 border-2 border-primary/20 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground mb-1">Estimated Price</p>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{calculatedPrice.toLocaleString("en-IN")}
                </div>
                {priceDiff !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${priceDiff > 0 ? "text-green-600" : "text-red-600"}`}>
                    {priceDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(priceDiff).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>
            <IndianRupee className="w-16 h-16 text-primary/20" />
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price</span>
              <span className="font-medium">₹{priceBreakdown.base.toLocaleString("en-IN")}</span>
            </div>
            {priceBreakdown.power !== 0 && (
              <div className="flex justify-between text-red-600">
                <span>Power Issue</span>
                <span>{priceBreakdown.power.toLocaleString("en-IN")}</span>
              </div>
            )}
            {priceBreakdown.display !== 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Display ({displayCondition})</span>
                <span>{priceBreakdown.display.toLocaleString("en-IN")}</span>
              </div>
            )}
            {priceBreakdown.body !== 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Body ({bodyCondition})</span>
                <span>{priceBreakdown.body.toLocaleString("en-IN")}</span>
              </div>
            )}
            {priceBreakdown.age !== 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Age ({monthsSinceLaunch} months old)</span>
                <span>{priceBreakdown.age.toLocaleString("en-IN")}</span>
              </div>
            )}
            {priceBreakdown.accessories > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Accessories Bonus</span>
                <span>+{priceBreakdown.accessories.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Device Powers On */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Does your device power on?</CardTitle>
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

        {/* Display Condition */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Condition</CardTitle>
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

        {/* Body Condition */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Body Condition</CardTitle>
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

        {/* Device Age - Auto Calculated */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Device Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Months since launch:</span>
                  <span className="font-bold text-lg">{monthsSinceLaunch} months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Age category:</span>
                  <span className="font-medium">{ageGroup} months</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Age is automatically calculated from the device's launch date
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accessories */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accessories Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="charger" checked={hasCharger} onCheckedChange={(checked) => setHasCharger(checked as boolean)} />
                <Label htmlFor="charger" className="cursor-pointer">Original Charger (+2%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bill" checked={hasBill} onCheckedChange={(checked) => setHasBill(checked as boolean)} />
                <Label htmlFor="bill" className="cursor-pointer">Original Bill (+2%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="box" checked={hasBox} onCheckedChange={(checked) => setHasBox(checked as boolean)} />
                <Label htmlFor="box" className="cursor-pointer">Original Box (+2%)</Label>
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
