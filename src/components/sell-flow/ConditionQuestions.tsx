// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  basePrice: number;
  deviceName: string;
  releaseDate: string;
  variantId: string;
  brandName?: string;
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

const ConditionQuestions = ({
  basePrice,
  deviceName,
  releaseDate,
  variantId,
  brandName,
  onComplete,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<"yesno" | "condition" | "accessories">("yesno");
  const [canMakeCalls, setCanMakeCalls] = useState<boolean | null>(null);
  const [isTouchWorking, setIsTouchWorking] = useState<boolean | null>(null);
  const [isScreenOriginal, setIsScreenOriginal] = useState<boolean | null>(null);
  const [isBatteryHealthy, setIsBatteryHealthy] = useState<boolean | null>(null);
  const [overallCondition, setOverallCondition] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("");

  const [hasOriginalCharger, setHasOriginalCharger] = useState<boolean | null>(null);
  const [hasOriginalBox, setHasOriginalBox] = useState<boolean | null>(null);
  const [hasPurchaseBill, setHasPurchaseBill] = useState<boolean | null>(null);
  const [hasNoneSelected, setHasNoneSelected] = useState<boolean>(false);

  const [finalPrice, setFinalPrice] = useState(0);
  const [basePriceFromAge, setBasePriceFromAge] = useState(0);
  const [warrantyPrices, setWarrantyPrices] = useState<any>(null);

  const callsRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);
  const accessoriesRef = useRef<HTMLDivElement>(null);

  const isAppleBrand =
    brandName?.toLowerCase().includes("apple") ||
    brandName?.toLowerCase().includes("iphone");

  useEffect(() => {
    if (canMakeCalls !== null)
      touchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [canMakeCalls]);
  useEffect(() => {
    if (isTouchWorking !== null)
      screenRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isTouchWorking]);
  useEffect(() => {
    if (isScreenOriginal !== null && isAppleBrand)
      batteryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isScreenOriginal, isAppleBrand]);
  useEffect(() => {
    if (currentStep === "condition")
      conditionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (currentStep === "accessories")
      accessoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentStep]);

  useEffect(() => {
    if (brandName && !isAppleBrand && isBatteryHealthy === null) setIsBatteryHealthy(true);
  }, [brandName, isAppleBrand, isBatteryHealthy]);

  useEffect(() => {
    const fetchWarrantyPrices = async () => {
      if (!variantId) return;
      const { data } = await supabase
        .from("warranty_prices")
        .select("*")
        .eq("variant_id", variantId)
        .maybeSingle();
      if (data) setWarrantyPrices(data);
    };
    fetchWarrantyPrices();
  }, [variantId]);

  useEffect(() => {
    if (ageGroup && warrantyPrices) updatePrice();
  }, [ageGroup, warrantyPrices]);
  useEffect(() => {
    if (overallCondition && ageGroup && warrantyPrices) updatePrice();
  }, [overallCondition, ageGroup, warrantyPrices]);
  useEffect(() => {
    if (ageGroup && warrantyPrices) updatePrice();
  }, [canMakeCalls, isTouchWorking, isScreenOriginal, isBatteryHealthy]);
  useEffect(() => {
    if (basePriceFromAge && warrantyPrices) calculateFinalPriceWithDeductions();
  }, [
    hasOriginalCharger,
    hasOriginalBox,
    hasPurchaseBill,
    hasNoneSelected,
    basePriceFromAge,
    warrantyPrices,
  ]);

  function updatePrice() {
    if (!ageGroup || !warrantyPrices) return;

    // Universal logic: always use table-driven numbers
    let price = basePrice;
    switch (ageGroup) {
      case "0-3": price = parseFloat(warrantyPrices.price_0_3_months ?? basePrice); break;
      case "3-6": price = parseFloat(warrantyPrices.price_3_6_months ?? basePrice); break;
      case "6-11": price = parseFloat(warrantyPrices.price_6_11_months ?? basePrice); break;
      case "12+": price = parseFloat(warrantyPrices.price_11_plus_months ?? basePrice); break;
      default: price = basePrice;
    }

    // --- NEW: Yes/No Question Deductions (Applied BEFORE condition deduction) ---
    let yesNoDeductionPercent = 0;

    // If customer selected "No" for calls, deduct percentage
    if (canMakeCalls === false) {
      const callDeduction = parseFloat(warrantyPrices.call_deduction_percentage ?? "0");
      yesNoDeductionPercent += callDeduction;
    }

    // If customer selected "No" for touch, deduct percentage
    if (isTouchWorking === false) {
      const touchDeduction = parseFloat(warrantyPrices.touch_deduction_percentage ?? "0");
      yesNoDeductionPercent += touchDeduction;
    }

    // If customer selected "No" for original screen, deduct percentage
    if (isScreenOriginal === false) {
      const screenDeduction = parseFloat(warrantyPrices.screen_deduction_percentage ?? "0");
      yesNoDeductionPercent += screenDeduction;
    }

    // If customer selected "No" for battery (Apple only), deduct percentage
    if (isAppleBrand && isBatteryHealthy === false) {
      const batteryDeduction = parseFloat(warrantyPrices.battery_deduction_percentage ?? "0");
      yesNoDeductionPercent += batteryDeduction;
    }

    // Apply yes/no deductions
    if (yesNoDeductionPercent > 0) {
      const deductionMultiplier = 1 - (yesNoDeductionPercent / 100);
      price = price * deductionMultiplier;
    }

    // --- Condition deduction (Applied AFTER yes/no deductions) ---
    let conditionPercent = 1;
    if (overallCondition === "good") {
      conditionPercent =
        parseFloat(warrantyPrices.phoneConditionDeduction_good ?? warrantyPrices.phoneconditiondeduction_good ?? "100");
    } else if (overallCondition === "average") {
      conditionPercent =
        parseFloat(warrantyPrices.phoneConditionDeduction_average ?? warrantyPrices.phoneconditiondeduction_average ?? "100");
    } else if (overallCondition === "below-average") {
      conditionPercent =
        parseFloat(warrantyPrices.phoneConditionDeduction_belowAverage ?? warrantyPrices.phoneconditiondeduction_belowaverage ?? "100");
    }
    conditionPercent = isNaN(conditionPercent) ? 1 : conditionPercent / 100;

    price = price * conditionPercent;

    setBasePriceFromAge(Math.round(price));
    setFinalPrice(Math.round(price));
  }

  function calculateFinalPriceWithDeductions() {
    if (!warrantyPrices) return;
    let price = basePriceFromAge;
    let totalDeduction = 0;

    // Accept both camelCase and snake_case from DB to support all variant DB schema
    const chargerDeduction = parseFloat(warrantyPrices.charger_deduction_amount ?? warrantyPrices.chargerdeductionamount ?? "0");
    const boxDeduction = parseFloat(warrantyPrices.box_deduction_amount ?? warrantyPrices.boxdeductionamount ?? "0");
    const billDeduction = parseFloat(warrantyPrices.bill_deduction_amount ?? warrantyPrices.billdeductionamount ?? "0");

    if (hasNoneSelected) totalDeduction = chargerDeduction + boxDeduction + billDeduction;
    else {
      if (hasOriginalCharger !== true) totalDeduction += chargerDeduction;
      if (hasOriginalBox !== true) totalDeduction += boxDeduction;
      if (hasPurchaseBill !== true) totalDeduction += billDeduction;
    }
    if (totalDeduction > 0) price -= totalDeduction;
    setFinalPrice(Math.round(price));
  }

  const handleNextToCondition = () => {
    if (
      canMakeCalls === null ||
      isTouchWorking === null ||
      isScreenOriginal === null
    ) {
      alert("Please answer all device condition questions");
      return;
    }
    if (isAppleBrand && isBatteryHealthy === null) {
      alert("Please answer all device condition questions");
      return;
    }
    setCurrentStep("condition");
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
  };

  const handleAccessoryToggle = (key: "charger" | "box" | "bill") => {
    setHasNoneSelected(false);
    if (key === "charger") setHasOriginalCharger((prev) => (prev === true ? null : true));
    if (key === "box") setHasOriginalBox((prev) => (prev === true ? null : true));
    if (key === "bill") setHasPurchaseBill((prev) => (prev === true ? null : true));
  };

  const handleNoneToggle = () => {
    const newNoneState = !hasNoneSelected;
    setHasNoneSelected(newNoneState);
    if (newNoneState) {
      setHasOriginalCharger(null);
      setHasOriginalBox(null);
      setHasPurchaseBill(null);
    }
  };

  const handleComplete = () => {
    const finalCharger = hasNoneSelected ? false : (hasOriginalCharger ?? false);
    const finalBox = hasNoneSelected ? false : (hasOriginalBox ?? false);
    const finalBill = hasNoneSelected ? false : (hasPurchaseBill ?? false);
    onComplete({
      canMakeCalls,
      isTouchWorking,
      isScreenOriginal,
      isBatteryHealthy,
      overallCondition,
      ageGroup,
      hasCharger: finalCharger,
      hasBox: finalBox,
      hasBill: finalBill,
    }, finalPrice);
  };

  const questions = [
    {
      question: "Are you able to make and receive calls?",
      description: "Check your device for cellular network connectivity issues.",
      value: canMakeCalls,
      setter: setCanMakeCalls,
      ref: callsRef,
    },
    {
      question: "Is your device's touch screen working properly?",
      description: "Check the touch screen functionality of your phone.",
      value: isTouchWorking,
      setter: setIsTouchWorking,
      ref: touchRef,
    },
    {
      question: "Is your phone's screen original?",
      description: "Pick 'Yes' if screen was never changed or was changed by Authorized Service Center. Pick 'No' if screen was changed at local shop.",
      value: isScreenOriginal,
      setter: setIsScreenOriginal,
      ref: screenRef,
    },
    ...(isAppleBrand
      ? [{
          question: "Battery Health above 80%",
          description: "Check if your device's battery health is above 80%.",
          value: isBatteryHealthy,
          setter: setIsBatteryHealthy,
          ref: batteryRef,
        }]
      : []),
  ];

  const conditionOptions = [
    { value: "good", label: "Good", description: "No scratch, No dent, Works perfectly" },
    { value: "average", label: "Average", description: "Visible scratches or dents but fully functional" },
    { value: "below-average", label: "Below Average", description: "Major Dents & Major Scratches" },
  ];
  const ageOptions = [
    { value: "0-3", label: "0-3 Months", description: "No Physical Damage" },
    { value: "3-6", label: "3-6 Months", description: "No Physical Damage" },
    { value: "6-11", label: "6-11 Months", description: "No Physical Damage" },
    { value: "12+", label: "11+ Months", description: "Out Of Warranty" },
  ];

  function getStepTitle() {
    if (currentStep === "yesno")
      return <>Tell us more about your <span style={{ color: "#4169E1" }}>{deviceName}</span></>;
    if (currentStep === "condition") return "Device Condition & Age";
    return "Do you have the following accessories?";
  }
  function getStepDescription() {
    if (currentStep === "yesno") return "Please answer a few questions about your device.";
    if (currentStep === "condition") return "Please provide device condition and age information.";
    return "Select the accessories you have.";
  }
  if (!variantId) return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Missing Variant Information</h2>
      <p className="text-muted-foreground">Please go back and select a device variant (storage option)</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "black" }}>{getStepTitle()}</h1>
          <p className="text-lg" style={{ color: "black" }}>{getStepDescription()}</p>
        </div>
        {currentStep === "yesno" && (
          <div className="space-y-6">
            {questions.map((question, idx) => (
              <Card key={idx} className="p-6" ref={question.ref}>
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold" style={{ color: "black" }}>{question.question}</h2>
                  <p className="text-lg" style={{ color: "black" }}>{question.description}</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => question.setter(true)}
                      className={`px-8 py-4 flex items-center gap-2 ${question.value !== true ? "opacity-50 hover:opacity-100" : ""}`}
                      style={{ backgroundColor: "royalBlue", color: "white" }}
                    ><CheckCircle size={20} /> Yes</Button>
                    <Button
                      onClick={() => question.setter(false)}
                      variant="outline"
                      className={`px-8 py-4 flex items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground ${question.value === false ? "bg-destructive text-destructive-foreground" : ""}`}
                    ><XCircle size={20} /> No</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {currentStep === "condition" && (
          <div className="space-y-6" ref={conditionRef}>
            <Card className="p-6" ref={ageRef}>
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold" style={{ color: "black" }}>How old is your phone?</h2>
                <div className="space-y-3">
                  {ageOptions.map(option => (
                    <Button
                      key={option.value}
                      onClick={() => setAgeGroup(option.value)}
                      className={`w-full px-6 py-4 text-left justify-start h-auto transition-all duration-200 ${ageGroup !== option.value ? "bg-muted/30 hover:bg-muted" : ""}`}
                      style={{ backgroundColor: ageGroup === option.value ? "royalBlue" : "", color: ageGroup === option.value ? "white" : "black" }}
                    ><div><div className="font-semibold">{option.label}</div><div className="text-sm opacity-75">{option.description}</div></div></Button>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold" style={{ color: "black" }}>What is the overall condition of your phone?</h2>
                <div className="space-y-3">
                  {conditionOptions.map(option => (
                    <Button
                      key={option.value}
                      onClick={() => setOverallCondition(option.value)}
                      className={`w-full px-6 py-4 text-left justify-start h-auto transition-all duration-200 ${overallCondition !== option.value ? "bg-muted/30 hover:bg-muted" : ""}`}
                      style={{
                        backgroundColor: overallCondition === option.value ? "royalBlue" : "",
                        color: overallCondition === option.value ? "white" : "black",
                      }}
                    ><div><div className="font-semibold">{option.label}</div><div className="text-sm opacity-75">{option.description}</div></div></Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
        {currentStep === "accessories" && (
          <div ref={accessoriesRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                onClick={() => handleAccessoryToggle("charger")}
                className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${hasOriginalCharger !== true ? "bg-muted/30 hover:bg-muted" : ""}`}
                style={{
                  backgroundColor: hasOriginalCharger === true ? "royalBlue" : "",
                  color: hasOriginalCharger === true ? "white" : "black",
                }}>
                <img src="/assets/charger.jpg" alt="Charger" className="w-16 h-16 object-contain" />
                <span className="font-semibold">Original Charger of Device</span>
                {hasOriginalCharger === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
              </Card>
              <Card
                onClick={() => handleAccessoryToggle("box")}
                className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${hasOriginalBox !== true ? "bg-muted/30 hover:bg-muted" : ""}`}
                style={{
                  backgroundColor: hasOriginalBox === true ? "royalBlue" : "",
                  color: hasOriginalBox === true ? "white" : "black",
                }}>
                <img src="/assets/box.jpg" alt="Box" className="w-16 h-16 object-contain" />
                <span className="font-semibold">Original Box with same IMEI</span>
                {hasOriginalBox === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
              </Card>
              <Card
                onClick={() => handleAccessoryToggle("bill")}
                className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${hasPurchaseBill !== true ? "bg-muted/30 hover:bg-muted" : ""}`}
                style={{
                  backgroundColor: hasPurchaseBill === true ? "royalBlue" : "",
                  color: hasPurchaseBill === true ? "white" : "black",
                }}>
                <img src="/assets/bill.jpg" alt="Bill" className="w-16 h-16 object-contain" />
                <span className="font-semibold">Bill of the device is available</span>
                {hasPurchaseBill === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
              </Card>
              <Card
                onClick={handleNoneToggle}
                className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${!hasNoneSelected ? "bg-muted/30 hover:bg-muted" : ""}`}
                style={{
                  backgroundColor: hasNoneSelected ? "royalBlue" : "",
                  color: hasNoneSelected ? "white" : "black",
                }}>
                <img src="/assets/none.jpg" alt="None" className="w-16 h-16 object-contain" />
                <span className="font-semibold">I don't have any of the following</span>
                {hasNoneSelected && <CheckCircle size={20} className="absolute top-2 right-2" />}
              </Card>
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center">
          {currentStep !== "yesno" && (
            <Button
              onClick={() =>
                setCurrentStep(currentStep === "condition" ? "yesno" : "condition")
              }
              variant="outline"
              className="w-full sm:w-auto px-12 py-4 text-lg"
            >Back</Button>
          )}
          {currentStep === "yesno" && (
            <Button
              onClick={handleNextToCondition}
              className="w-full sm:w-auto px-12 py-4 text-lg"
              style={{ backgroundColor: "royalBlue", color: "white" }}
              disabled={questions.some((q) => q.value === null)}
            >Next</Button>
          )}
          {currentStep === "condition" && (
            <Button
              onClick={handleNextToAccessories}
              className="w-full sm:w-auto px-12 py-4 text-lg"
              style={{ backgroundColor: "royalBlue", color: "white" }}
              disabled={!overallCondition || !ageGroup}
            >Next</Button>
          )}
          {currentStep === "accessories" && (
            <Button
              onClick={handleComplete}
              className="w-full sm:w-auto px-12 py-4 text-lg"
              style={{ backgroundColor: "royalBlue", color: "white" }}
            >Continue to Verification</Button>
          )}
        </div>
        {/* No public price visible! */}
      </div>
    </div>
  );
};

export default ConditionQuestions;
