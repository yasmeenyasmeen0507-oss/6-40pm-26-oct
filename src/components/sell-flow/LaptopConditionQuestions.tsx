import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  variantId: string;
  deviceName: string;
  brandName: string;
  onComplete: (ageRange: string, condition: string, finalPrice: number) => void;
}

const LaptopConditionQuestions = ({ variantId, deviceName, brandName, onComplete }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [hasCharger, setHasCharger] = useState<boolean | null>(null);
  const [hasBox, setHasBox] = useState<boolean | null>(null);
  const [hasBill, setHasBill] = useState<boolean | null>(null);
  const [hasNone, setHasNone] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const questions = [
    {
      id: "age",
      title: `How old is your ${deviceName}?`,
      subtitle: "Select the age range of your device",
      options: [
        { value: "<1yr", label: "Less than 1 year", color: "bg-green-100 border-green-300 text-green-800" },
        { value: "1-3yrs", label: "1-3 years", color: "bg-blue-100 border-blue-300 text-blue-800" },
        { value: ">3yrs", label: "More than 3 years", color: "bg-orange-100 border-orange-300 text-orange-800" },
      ],
    },
    {
      id: "condition",
      title: "What's the overall condition?",
      subtitle: "Be honest for accurate pricing",
      options: [
        { value: "good", label: "Good - Minor/no scratches", color: "bg-green-100 border-green-300 text-green-800" },
        { value: "average", label: "Average - Some scratches/dents", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
        { value: "below_average", label: "Below Average - Visible damage", color: "bg-red-100 border-red-300 text-red-800" },
      ],
    },
  ];

  const handleAgeSelect = (value: string) => setAgeRange(value);
  const handleConditionSelect = (value: string) => setCondition(value);

  const handleBothContinue = () => {
    if (ageRange && condition) setCurrentQuestion(1);
  };

  const handleAccessoryToggle = (accessory: "charger" | "box" | "bill") => {
    setHasNone(false);
    if (accessory === "charger") setHasCharger((prev) => (prev === true ? null : true));
    if (accessory === "box") setHasBox((prev) => (prev === true ? null : true));
    if (accessory === "bill") setHasBill((prev) => (prev === true ? null : true));
  };

  const handleNoneToggle = () => {
    const newNoneState = !hasNone;
    setHasNone(newNoneState);
    if (newNoneState) {
      setHasCharger(null);
      setHasBox(null);
      setHasBill(null);
    }
  };

  const handleAccessoryContinue = () => {
    calculateFinalPrice(ageRange!, condition!, hasCharger ?? false, hasBox ?? false, hasBill ?? false);
  };

  const calculateFinalPrice = async (
    selectedAge: string, 
    selectedCondition: string,
    charger: boolean,
    box: boolean,
    bill: boolean
  ) => {
    setCalculating(true);
    try {
      const { data: pricingData, error } = await supabase
        .from("laptop_prices")
        .select("*")
        .eq("variant_id", variantId)
        .single();

      if (error || !pricingData) {
        toast.error("Pricing not available for this configuration");
        console.error("Pricing error:", error);
        return;
      }

      let basePrice = 0;
      if (selectedAge === "<1yr") {
        basePrice = pricingData.price_less_than_1yr;
      } else if (selectedAge === "1-3yrs") {
        basePrice = pricingData.price_1_to_3yrs;
      } else {
        basePrice = pricingData.price_more_than_3yrs;
      }

      let conditionDeduction = 0;
      if (selectedCondition === "good") {
        conditionDeduction = pricingData.condition_deduction_good || 0;
      } else if (selectedCondition === "average") {
        conditionDeduction = pricingData.condition_deduction_average || 10;
      } else {
        conditionDeduction = pricingData.condition_deduction_below_average || 25;
      }

      let priceAfterCondition = basePrice * (1 - conditionDeduction / 100);

      let accessoryDeductions = 0;
      if (!charger) {
        accessoryDeductions += pricingData.charger_deduction_amount || 1500;
      }
      if (!box) {
        accessoryDeductions += pricingData.box_deduction_amount || 500;
      }
      if (!bill) {
        accessoryDeductions += pricingData.bill_deduction_amount || 300;
      }

      const finalPrice = Math.round(priceAfterCondition - accessoryDeductions);

      onComplete(selectedAge, selectedCondition, finalPrice);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("Failed to calculate price");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">
          Tell us about your <span style={{ color: "#4169E1" }}>{deviceName}</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg">
          Question {currentQuestion + 1} of 2
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#4169E1]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentQuestion + 1) / 2) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Combined Age & Condition Questions */}
        {currentQuestion === 0 && (
          <motion.div
            key="age-condition"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8 shadow-lg space-y-8">
              {/* Age Question */}
              <div>
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{questions[0].title}</h3>
                  <p className="text-sm text-muted-foreground">{questions[0].subtitle}</p>
                </div>
                <div className="space-y-3">
                  {questions[0].options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAgeSelect(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${option.color} hover:scale-[1.02] hover:shadow-md ${(ageRange === option.value ? "border-[#4169E1] ring-2 ring-[#4169E1]" : "")}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base md:text-lg">{option.label}</span>
                        {ageRange === option.value ? <CheckCircle2 className="w-5 h-5 text-[#4169E1]" /> : <ArrowRight className="w-5 h-5" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Condition Question */}
              <div>
                <div className="mb-3 mt-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{questions[1].title}</h3>
                  <p className="text-sm text-muted-foreground">{questions[1].subtitle}</p>
                </div>
                <div className="space-y-3">
                  {questions[1].options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleConditionSelect(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${option.color} hover:scale-[1.02] hover:shadow-md ${(condition === option.value ? "border-[#4169E1] ring-2 ring-[#4169E1]" : "")}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base md:text-lg">{option.label}</span>
                        {condition === option.value ? <CheckCircle2 className="w-5 h-5 text-[#4169E1]" /> : <ArrowRight className="w-5 h-5" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleBothContinue}
                size="lg"
                disabled={!ageRange || !condition}
                className="w-full mt-6 bg-[#4169E1] hover:bg-[#3557C1] text-lg py-6"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Accessories Question - SAME UI AS PHONE */}
        {currentQuestion === 1 && (
          <motion.div
            key="accessories"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8 shadow-lg">
              <div className="mb-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Do you have the following accessories?</h3>
                <p className="text-sm text-muted-foreground">Select the accessories you have.</p>
              </div>
              
              {/* Grid Layout - Same as Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Charger Card */}
                <Card
                  onClick={() => handleAccessoryToggle("charger")}
                  className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${
                    hasCharger !== true ? "bg-muted/30 hover:bg-muted" : ""
                  }`}
                  style={{
                    backgroundColor: hasCharger === true ? "royalBlue" : "",
                    color: hasCharger === true ? "white" : "black",
                  }}
                >
                  <img src="/assets/charger.jpg" alt="Charger" className="w-16 h-16 object-contain" />
                  <span className="font-semibold">Original Charger of Device</span>
                  {hasCharger === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
                </Card>

                {/* Box Card */}
                <Card
                  onClick={() => handleAccessoryToggle("box")}
                  className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${
                    hasBox !== true ? "bg-muted/30 hover:bg-muted" : ""
                  }`}
                  style={{
                    backgroundColor: hasBox === true ? "royalBlue" : "",
                    color: hasBox === true ? "white" : "black",
                  }}
                >
                  <img src="/assets/box.jpg" alt="Box" className="w-16 h-16 object-contain" />
                  <span className="font-semibold">Original Box with same IMEI</span>
                  {hasBox === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
                </Card>

                {/* Bill Card */}
                <Card
                  onClick={() => handleAccessoryToggle("bill")}
                  className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${
                    hasBill !== true ? "bg-muted/30 hover:bg-muted" : ""
                  }`}
                  style={{
                    backgroundColor: hasBill === true ? "royalBlue" : "",
                    color: hasBill === true ? "white" : "black",
                  }}
                >
                  <img src="/assets/bill.jpg" alt="Bill" className="w-16 h-16 object-contain" />
                  <span className="font-semibold">Bill of the device is available</span>
                  {hasBill === true && <CheckCircle size={20} className="absolute top-2 right-2" />}
                </Card>

                {/* None Card */}
                <Card
                  onClick={handleNoneToggle}
                  className={`p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 relative h-full ${
                    !hasNone ? "bg-muted/30 hover:bg-muted" : ""
                  }`}
                  style={{
                    backgroundColor: hasNone ? "royalBlue" : "",
                    color: hasNone ? "white" : "black",
                  }}
                >
                  <img src="/assets/none.jpg" alt="None" className="w-16 h-16 object-contain" />
                  <span className="font-semibold">I don't have any of the following</span>
                  {hasNone && <CheckCircle size={20} className="absolute top-2 right-2" />}
                </Card>
              </div>

              <Button
                onClick={handleAccessoryContinue}
                disabled={calculating}
                size="lg"
                className="w-full mt-6 bg-[#4169E1] hover:bg-[#3557C1] text-lg py-6"
              >
                {calculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Continue
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary of previous answers */}
      {(ageRange || condition) && currentQuestion > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-wrap gap-3 justify-center"
        >
          {ageRange && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                Age: {questions[0].options.find(o => o.value === ageRange)?.label}
              </span>
            </div>
          )}
          {condition && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                Condition: {questions[1].options.find(o => o.value === condition)?.label.split(' - ')[0]}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LaptopConditionQuestions;