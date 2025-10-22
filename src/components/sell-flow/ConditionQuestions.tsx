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

const ConditionQuestions = ({ basePrice, deviceName, onComplete }: Props) => {
  const [devicePowersOn, setDevicePowersOn] = useState(true);
  const [displayCondition, setDisplayCondition] = useState("excellent");
  const [bodyCondition, setBodyCondition] = useState("excellent");
  const [ageGroup, setAgeGroup] = useState("0-3");
  const [hasCharger, setHasCharger] = useState(false);
  const [hasBill, setHasBill] = useState(false);
  const [hasBox, setHasBox] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(basePrice);

  useEffect(() => {
    calculatePrice();
  }, [devicePowersOn, displayCondition, bodyCondition, ageGroup, hasCharger, hasBill, hasBox]);

  const calculatePrice = () => {
    let price = basePrice;

    // Power penalty
    if (!devicePowersOn) {
      price *= 0.5; // 50% penalty
    }

    // Display condition adjustment
    const displayPenalty: Record<string, number> = {
      excellent: 0,
      good: 0.05,
      fair: 0.15,
      poor: 0.3,
    };
    price -= price * displayPenalty[displayCondition];

    // Body condition adjustment
    const bodyPenalty: Record<string, number> = {
      excellent: 0,
      good: 0.03,
      fair: 0.1,
      poor: 0.2,
    };
    price -= price * bodyPenalty[bodyCondition];

    // Age depreciation
    const ageDepreciation: Record<string, number> = {
      "0-3": 0,
      "3-6": 0.08,
      "6-11": 0.15,
      "12+": 0.25,
    };
    price -= price * ageDepreciation[ageGroup];

    // Accessories bonus
    let accessoryCount = 0;
    if (hasCharger) accessoryCount++;
    if (hasBill) accessoryCount++;
    if (hasBox) accessoryCount++;
    price += price * (accessoryCount * 0.02); // 2% bonus per accessory

    setCalculatedPrice(Math.round(price));
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
          <div className="flex items-center justify-between">
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

        {/* Age Group */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How old is your device?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={ageGroup} onValueChange={setAgeGroup}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0-3" id="age-0-3" />
                  <Label htmlFor="age-0-3" className="cursor-pointer">0-3 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-6" id="age-3-6" />
                  <Label htmlFor="age-3-6" className="cursor-pointer">3-6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-11" id="age-6-11" />
                  <Label htmlFor="age-6-11" className="cursor-pointer">6-11 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12+" id="age-12+" />
                  <Label htmlFor="age-12+" className="cursor-pointer">12+ months</Label>
                </div>
              </RadioGroup>
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
