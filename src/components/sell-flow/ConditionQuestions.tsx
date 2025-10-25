// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IndianRupee, Loader2, Calendar, Check, X, Smartphone, Star, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  basePrice: number;
  deviceName: string;
  releaseDate: string;
  variantId: string;
  onComplete: (
    condition: {
      canMakeCalls: boolean;
      isTouchWorking: boolean;
      isScreenOriginal: boolean;
      isBatteryHealthy: boolean;
      overallCondition: string;
      ageGroup: string;
    },
    finalPrice: number
  ) => void;
}

const ConditionQuestions = ({ basePrice, deviceName, releaseDate, variantId, onComplete }: Props) => {
  const [currentStep, setCurrentStep] = useState<"yesno" | "condition">("yesno");

  const [canMakeCalls, setCanMakeCalls] = useState<boolean | null>(null);
  const [isTouchWorking, setIsTouchWorking] = useState<boolean | null>(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState<boolean | null>(null);
  const [isBatteryHealthy, setIsBatteryHealthy] = useState<boolean | null>(null);

  const [overallCondition, setOverallCondition] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("");

  const [finalPrice, setFinalPrice] = useState(0);
  const [warrantyPrices, setWarrantyPrices] = useState<any>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);

  const callsRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWarrantyPrices = async () => {
      setLoadingPrices(true);
      const { data, error } = await supabase
        .from("warranty_prices")
        .select("*")
        .eq("variant_id", variantId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching warranty prices:", error);
      } else {
        setWarrantyPrices(data);
      }
      setLoadingPrices(false);
    };

    fetchWarrantyPrices();
  }, [variantId]);

  useEffect(() => {
    if (ageGroup && warrantyPrices) {
      updatePrice();
    }
  }, [ageGroup, warrantyPrices]);

  // Auto-scroll effects
  useEffect(() => {
    if (canMakeCalls !== null && touchRef.current) {
      setTimeout(() => {
        touchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [canMakeCalls]);

  useEffect(() => {
    if (isTouchWorking !== null && screenRef.current) {
      setTimeout(() => {
        screenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isTouchWorking]);

  useEffect(() => {
    if (isScreenOriginal !== null && batteryRef.current) {
      setTimeout(() => {
        batteryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isScreenOriginal]);

  // Auto-scroll for condition screen
  useEffect(() => {
    if (overallCondition && ageRef.current && currentStep === "condition") {
      setTimeout(() => {
        ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [overallCondition, currentStep]);

  const updatePrice = () => {
    if (!ageGroup || !warrantyPrices) {
      return;
    }

    let price = basePrice;

    switch (ageGroup) {
      case "0-3":
        price = parseFloat(warrantyPrices.price_0_3_months);
        break;
      case "3-6":
        price = parseFloat(warrantyPrices.price_3_6_months);
        break;
      case "6-11":
        price = parseFloat(warrantyPrices.price_6_11_months);
        break;
      case "12+":
        price = parseFloat(warrantyPrices.price_11_plus_months);
        break;
      default:
        price = basePrice;
    }

    setFinalPrice(Math.round(price));
  };

  const getWarrantyStatusLabel = (age: string) => {
    switch (age) {
      case "0-3":
        return "0-3 Months - No Physical Damage";
      case "3-6":
        return "3-6 Months - No Physical Damage";
      case "6-11":
        return "6-11 Months - No Physical Damage";
      case "12+":
        return "11+ Months - Out Of Warranty";
      default:
        return "Please select device age";
    }
  };

  const handleNextToCondition = () => {
    if (canMakeCalls === null || isTouchWorking === null || 
        isScreenOriginal === null || isBatteryHealthy === null) {
      alert("Please answer all device condition questions");
      return;
    }
    setCurrentStep("condition");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    if (!overallCondition) {
      alert("Please select the overall condition of your device");
      return;
    }
    
    if (!ageGroup) {
      alert("Please select when you purchased your device");
      return;
    }

    onComplete(
      {
        canMakeCalls,
        isTouchWorking,
        isScreenOriginal,
        isBatteryHealthy,
        overallCondition,
        ageGroup,
      },
      finalPrice
    );
  };

  const YesNoButton = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: boolean | null; 
    onChange: (val: boolean) => void;
    label: string;
  }) => (
    <div className="flex gap-3 justify-center">
      <Button
        onClick={() => onChange(true)}
        variant={value === true ? "default" : "outline"}
        className={`flex-1 h-16 text-lg font-medium transition-all ${
          value === true 
            ? "bg-green-500 hover:bg-green-600 text-white border-green-500" 
            : "hover:border-green-300"
        }`}
      >
        <Check className="w-5 h-5 mr-2" />
        Yes
      </Button>
      <Button
        onClick={() => onChange(false)}
        variant={value === false ? "default" : "outline"}
        className={`flex-1 h-16 text-lg font-medium transition-all ${
          value === false 
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
            : "hover:border-red-300"
        }`}
      >
        <X className="w-5 h-5 mr-2" />
        No
      </Button>
    </div>
  );

  // Step 1: Yes/No Questions
  if (currentStep === "yesno") {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Tell Us About Your {deviceName}</h2>
          <p className="text-muted-foreground">Answer these questions for assessment purposes during pickup</p>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            ref={callsRef}
          >
            <Card className={canMakeCalls !== null ? "border-2 border-green-200" : ""}>
              <CardHeader>
                <CardTitle className="text-lg">Are you able to make and receive calls?</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Check your device for cellular network connectivity issues.
                </p>
              </CardHeader>
              <CardContent>
                <YesNoButton 
                  value={canMakeCalls} 
                  onChange={setCanMakeCalls}
                  label="Can make calls"
                />
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {canMakeCalls !== null && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.1 }}
                ref={touchRef}
              >
                <Card className={isTouchWorking !== null ? "border-2 border-green-200" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Is your device's touch screen working properly?</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Check the touch screen functionality of your phone.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <YesNoButton 
                      value={isTouchWorking} 
                      onChange={setIsTouchWorking}
                      label="Touch working"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isTouchWorking !== null && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.1 }}
                ref={screenRef}
              >
                <Card className={isScreenOriginal !== null ? "border-2 border-green-200" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Is your phone's screen original?</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pick 'Yes' if screen was never changed or was changed by Authorized Service Center. 
                      Pick 'No' if screen was changed at local shop.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <YesNoButton 
                      value={isScreenOriginal} 
                      onChange={setIsScreenOriginal}
                      label="Original screen"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isScreenOriginal !== null && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.1 }}
                ref={batteryRef}
              >
                <Card className={isBatteryHealthy !== null ? "border-2 border-green-200" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Battery Health above 80%</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Check if your device's battery health is above 80%.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <YesNoButton 
                      value={isBatteryHealthy} 
                      onChange={setIsBatteryHealthy}
                      label="Battery healthy"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleNextToCondition} 
            className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-6 text-lg"
            disabled={canMakeCalls === null || isTouchWorking === null || 
                     isScreenOriginal === null || isBatteryHealthy === null}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Overall Condition and Age
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Device Condition & Age</h2>
        <p className="text-muted-foreground">Help us determine the best offer for your {deviceName}</p>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className={overallCondition ? "border-2 border-green-200" : ""}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                What is the overall condition of your phone?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={overallCondition} onValueChange={setOverallCondition}>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors border-2 border-transparent hover:border-green-200">
                  <RadioGroupItem value="good" id="condition-good" />
                  <Label htmlFor="condition-good" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-semibold text-base">Good</div>
                        <div className="text-sm text-muted-foreground">No scratch, No dent, Works perfectly</div>
                      </div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors border-2 border-transparent hover:border-yellow-200 mt-3">
                  <RadioGroupItem value="average" id="condition-average" />
                  <Label htmlFor="condition-average" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <div>
                        <div className="font-semibold text-base">Average</div>
                        <div className="text-sm text-muted-foreground">Visible scratches or dents but fully functional</div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent transition-colors border-2 border-transparent hover:border-orange-200 mt-3">
                  <RadioGroupItem value="below-average" id="condition-below" />
                  <Label htmlFor="condition-below" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-semibold text-base">Below Average</div>
                        <div className="text-sm text-muted-foreground">Major Dents & Major Scratches</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {overallCondition && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div ref={ageRef}>
                <Card className={ageGroup ? "border-2 border-green-200" : "border-2 border-primary/30"}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      How old is your phone?
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">This affects your warranty status and offer price</p>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={ageGroup} onValueChange={setAgeGroup}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                        <RadioGroupItem value="0-3" id="age-0-3" />
                        <Label htmlFor="age-0-3" className="cursor-pointer flex-1">
                          <div className="font-medium">0-3 Months</div>
                          <div className="text-xs text-muted-foreground">No Physical Damage</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                        <RadioGroupItem value="3-6" id="age-3-6" />
                        <Label htmlFor="age-3-6" className="cursor-pointer flex-1">
                          <div className="font-medium">3-6 Months</div>
                          <div className="text-xs text-muted-foreground">No Physical Damage</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                        <RadioGroupItem value="6-11" id="age-6-11" />
                        <Label htmlFor="age-6-11" className="cursor-pointer flex-1">
                          <div className="font-medium">6-11 Months</div>
                          <div className="text-xs text-muted-foreground">No Physical Damage</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent transition-colors">
                        <RadioGroupItem value="12+" id="age-12plus" />
                        <Label htmlFor="age-12plus" className="cursor-pointer flex-1">
                          <div className="font-medium">11+ Months</div>
                          <div className="text-xs text-muted-foreground">Out Of Warranty</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => {
            setCurrentStep("yesno");
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-6 text-lg"
        >
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={handleComplete} 
          className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-6 text-lg"
          disabled={!ageGroup || !overallCondition}
        >
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default ConditionQuestions;