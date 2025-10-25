// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, Calendar, Smartphone, Star, AlertCircle, Zap, Package, FileText } from "lucide-react";
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
      hasCharger: boolean;
      hasBox: boolean;
      hasBill: boolean;
    },
    finalPrice: number
  ) => void;
}

const ConditionQuestions = ({ basePrice, deviceName, releaseDate, variantId, onComplete }: Props) => {
  console.log('🔍 ConditionQuestions Props:', {
    basePrice,
    deviceName,
    releaseDate,
    variantId,
    hasOnComplete: typeof onComplete === 'function'
  });

  const [currentStep, setCurrentStep] = useState<"yesno" | "condition" | "accessories">("yesno");

  // Step 1: Yes/No Questions
  const [canMakeCalls, setCanMakeCalls] = useState<boolean | null>(null);
  const [isTouchWorking, setIsTouchWorking] = useState<boolean | null>(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState<boolean | null>(null);
  const [isBatteryHealthy, setIsBatteryHealthy] = useState<boolean | null>(null);

  // Step 2: Condition & Age
  const [overallCondition, setOverallCondition] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("");

  // Step 3: Accessories & Documents
  const [hasOriginalCharger, setHasOriginalCharger] = useState<boolean | null>(null);
  const [hasOriginalBox, setHasOriginalBox] = useState<boolean | null>(null);
  const [hasPurchaseBill, setHasPurchaseBill] = useState<boolean | null>(null);

  const [finalPrice, setFinalPrice] = useState(0);
  const [basePriceFromAge, setBasePriceFromAge] = useState(0);
  const [warrantyPrices, setWarrantyPrices] = useState<any>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);

  const callsRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);
  const chargerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);

  // Fetch warranty prices (now includes deduction amounts!)
  useEffect(() => {
    const fetchWarrantyPrices = async () => {
      if (!variantId) {
        console.error('❌ No variantId provided!');
        return;
      }

      console.log('🔍 Fetching warranty prices for variant:', variantId);
      setLoadingPrices(true);
      
      try {
        const { data, error } = await supabase
          .from("warranty_prices")
          .select("*")
          .eq("variant_id", variantId)
          .maybeSingle();

        console.log('📊 Warranty prices result:', { data, error });

        if (error) {
          console.error("❌ Error fetching warranty prices:", error);
        } else if (!data) {
          console.warn('⚠️ No warranty prices found for this variant');
        } else {
          console.log('✅ Warranty prices loaded:', data);
          setWarrantyPrices(data);
        }
      } catch (err) {
        console.error('❌ Exception fetching warranty prices:', err);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchWarrantyPrices();
  }, [variantId]);

  // Update price when age group changes
  useEffect(() => {
    if (ageGroup && warrantyPrices) {
      updatePrice();
    }
  }, [ageGroup, warrantyPrices]);

  // Recalculate price when accessories change
  useEffect(() => {
    if (basePriceFromAge > 0 && warrantyPrices && hasOriginalCharger !== null && hasOriginalBox !== null && hasPurchaseBill !== null) {
      calculateFinalPriceWithDeductions();
    }
  }, [hasOriginalCharger, hasOriginalBox, hasPurchaseBill, basePriceFromAge]);

  // Auto-scroll effects for Step 1
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

  // Auto-scroll effects for Step 2
  useEffect(() => {
    if (overallCondition && ageRef.current && currentStep === "condition") {
      setTimeout(() => {
        ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [overallCondition, currentStep]);

  // Auto-scroll effects for Step 3
  useEffect(() => {
    if (hasOriginalCharger !== null && boxRef.current && currentStep === "accessories") {
      setTimeout(() => {
        boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [hasOriginalCharger, currentStep]);

  useEffect(() => {
    if (hasOriginalBox !== null && billRef.current && currentStep === "accessories") {
      setTimeout(() => {
        billRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [hasOriginalBox, currentStep]);

  const updatePrice = () => {
    if (!ageGroup || !warrantyPrices) {
      console.warn('⚠️ Cannot update price - missing age group or warranty prices');
      return;
    }

    let price = basePrice;

    switch (ageGroup) {
      case "0-3":
        price = parseFloat(warrantyPrices.price_0_3_months);
        console.log('💰 Price for 0-3 months:', price);
        break;
      case "3-6":
        price = parseFloat(warrantyPrices.price_3_6_months);
        console.log('💰 Price for 3-6 months:', price);
        break;
      case "6-11":
        price = parseFloat(warrantyPrices.price_6_11_months);
        console.log('💰 Price for 6-11 months:', price);
        break;
      case "12+":
        price = parseFloat(warrantyPrices.price_11_plus_months);
        console.log('💰 Price for 12+ months:', price);
        break;
      default:
        price = basePrice;
        console.log('💰 Using base price:', price);
    }

    const roundedPrice = Math.round(price);
    console.log('💰 Base price from age group:', roundedPrice);
    setBasePriceFromAge(roundedPrice);
    setFinalPrice(roundedPrice);
  };

  // Calculate final price using fixed amount deductions
  const calculateFinalPriceWithDeductions = () => {
    if (!warrantyPrices) return;

    let price = basePriceFromAge;
    let totalDeduction = 0;

    // Get deduction amounts from warranty_prices (with fallback to 0)
    const chargerDeduction = parseFloat(warrantyPrices.charger_deduction_amount || 0);
    const boxDeduction = parseFloat(warrantyPrices.box_deduction_amount || 0);
    const billDeduction = parseFloat(warrantyPrices.bill_deduction_amount || 0);

    // Calculate total deduction amount
    if (hasOriginalCharger === false) {
      totalDeduction += chargerDeduction;
      console.log(`📉 No charger: -₹${chargerDeduction}`);
    }
    if (hasOriginalBox === false) {
      totalDeduction += boxDeduction;
      console.log(`📉 No box: -₹${boxDeduction}`);
    }
    if (hasPurchaseBill === false) {
      totalDeduction += billDeduction;
      console.log(`📉 No bill: -₹${billDeduction}`);
    }

    // Apply deductions
    if (totalDeduction > 0) {
      price = price - totalDeduction;
      console.log(`💰 Total deduction: ₹${Math.round(totalDeduction)}`);
    }

    const roundedPrice = Math.round(price);
    console.log('💰 Final price after deductions:', roundedPrice);
    setFinalPrice(roundedPrice);
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

  const handleNextToAccessories = () => {
    if (!overallCondition) {
      alert("Please select the overall condition of your device");
      return;
    }
    
    if (!ageGroup) {
      alert("Please select when you purchased your device");
      return;
    }

    if (!finalPrice || finalPrice === 0) {
      alert("Price calculation error. Please refresh and try again.");
      return;
    }

    setCurrentStep("accessories");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    if (hasOriginalCharger === null) {
      alert("Please answer if you have the original charger");
      return;
    }

    if (hasOriginalBox === null) {
      alert("Please answer if you have the original box");
      return;
    }

    if (hasPurchaseBill === null) {
      alert("Please answer if you have the purchase bill");
      return;
    }

    console.log('✅ Completing with:', {
      canMakeCalls,
      isTouchWorking,
      isScreenOriginal,
      isBatteryHealthy,
      overallCondition,
      ageGroup,
      hasCharger: hasOriginalCharger,
      hasBox: hasOriginalBox,
      hasBill: hasPurchaseBill,
      basePriceFromAge,
      finalPrice
    });

    onComplete(
      {
        canMakeCalls,
        isTouchWorking,
        isScreenOriginal,
        isBatteryHealthy,
        overallCondition,
        ageGroup,
        hasCharger: hasOriginalCharger,
        hasBox: hasOriginalBox,
        hasBill: hasPurchaseBill,
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

  if (!variantId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Missing Variant Information</h2>
        <p className="text-muted-foreground">Please go back and select a device variant (storage option)</p>
      </div>
    );
  }

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
  if (currentStep === "condition") {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Device Condition & Age</h2>
          <p className="text-muted-foreground">Help us determine the best offer for your {deviceName}</p>
          {loadingPrices && (
            <p className="text-sm text-blue-500 mt-2">Loading pricing information...</p>
          )}
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
            onClick={handleNextToAccessories} 
            className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-6 text-lg"
            disabled={!ageGroup || !overallCondition || !finalPrice}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Accessories & Documents - NO DEDUCTION WARNINGS
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Accessories & Documents</h2>
        <p className="text-muted-foreground">Let us know what you have with your {deviceName}</p>
      </div>

      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          ref={chargerRef}
        >
          <Card className={hasOriginalCharger !== null ? "border-2 border-green-200" : ""}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Do you have the original charger?
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                The original charging adapter and cable that came with your device
              </p>
            </CardHeader>
            <CardContent>
              <YesNoButton 
                value={hasOriginalCharger} 
                onChange={setHasOriginalCharger}
                label="Original charger"
              />
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {hasOriginalCharger !== null && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              ref={boxRef}
            >
              <Card className={hasOriginalBox !== null ? "border-2 border-green-200" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    Do you have the original box with matching IMEI?
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    The retail box with IMEI/Serial number matching your device
                  </p>
                </CardHeader>
                <CardContent>
                  <YesNoButton 
                    value={hasOriginalBox} 
                    onChange={setHasOriginalBox}
                    label="Original box"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasOriginalBox !== null && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              ref={billRef}
            >
              <Card className={hasPurchaseBill !== null ? "border-2 border-green-200" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Do you have the purchase bill/invoice?
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Original receipt or invoice from authorized retailer
                  </p>
                </CardHeader>
                <CardContent>
                  <YesNoButton 
                    value={hasPurchaseBill} 
                    onChange={setHasPurchaseBill}
                    label="Purchase bill"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => {
            setCurrentStep("condition");
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
          disabled={hasOriginalCharger === null || hasOriginalBox === null || hasPurchaseBill === null}
        >
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default ConditionQuestions;