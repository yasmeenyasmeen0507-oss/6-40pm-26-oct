import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategorySelection from "@/components/sell-flow/CategorySelection";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import CitySelection from "@/components/sell-flow/CitySelection";
import VariantSelection from "@/components/sell-flow/VariantSelection";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = 
  | "category" 
  | "brand" 
  | "device" 
  | "city" 
  | "variant" 
  | "condition" 
  | "otp" 
  | "valuation" 
  | "pickup";

export type DeviceCategory = "phone" | "laptop" | "ipad";

export interface FlowState {
  category: DeviceCategory | null;
  brandId: string | null;
  brandName: string | null;
  deviceId: string | null;
  deviceName: string | null;
  cityId: string | null;
  cityName: string | null;
  variantId: string | null;
  storageGb: number | null;
  basePrice: number | null;
  condition: {
    devicePowersOn: boolean;
    displayCondition: string;
    bodyCondition: string;
    ageGroup: string;
    hasCharger: boolean;
    hasBill: boolean;
    hasBox: boolean;
  } | null;
  phoneNumber: string | null;
  finalPrice: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [flowState, setFlowState] = useState<FlowState>({
    category: null,
    brandId: null,
    brandName: null,
    deviceId: null,
    deviceName: null,
    cityId: null,
    cityName: null,
    variantId: null,
    storageGb: null,
    basePrice: null,
    condition: null,
    phoneNumber: null,
    finalPrice: 0,
  });

  const updateFlowState = (updates: Partial<FlowState>) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  const goBack = () => {
    const stepOrder: Step[] = ["category", "brand", "device", "city", "variant", "condition", "otp", "valuation", "pickup"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const canGoBack = currentStep !== "category" && currentStep !== "valuation" && currentStep !== "pickup";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SellkarIndia
            </span>
          </div>
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CategorySelection
                onSelect={(category) => {
                  updateFlowState({ category });
                  setCurrentStep("brand");
                }}
              />
            </motion.div>
          )}

          {currentStep === "brand" && flowState.category && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <BrandSelection
                category={flowState.category}
                onSelect={(brandId, brandName) => {
                  updateFlowState({ brandId, brandName });
                  setCurrentStep("device");
                }}
              />
            </motion.div>
          )}

          {currentStep === "device" && flowState.brandId && (
            <motion.div
              key="device"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <DeviceSelection
                brandId={flowState.brandId}
                onSelect={(deviceId, deviceName) => {
                  updateFlowState({ deviceId, deviceName });
                  setCurrentStep("city");
                }}
              />
            </motion.div>
          )}

          {currentStep === "city" && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <CitySelection
                onSelect={(cityId, cityName) => {
                  updateFlowState({ cityId, cityName });
                  setCurrentStep("variant");
                }}
              />
            </motion.div>
          )}

          {currentStep === "variant" && flowState.deviceId && (
            <motion.div
              key="variant"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <VariantSelection
                deviceId={flowState.deviceId}
                onSelect={(variantId, storageGb, basePrice) => {
                  updateFlowState({ variantId, storageGb, basePrice });
                  setCurrentStep("condition");
                }}
              />
            </motion.div>
          )}

          {currentStep === "condition" && flowState.basePrice !== null && (
            <motion.div
              key="condition"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ConditionQuestions
                basePrice={flowState.basePrice}
                deviceName={flowState.deviceName || ""}
                onComplete={(condition, finalPrice) => {
                  updateFlowState({ condition, finalPrice });
                  setCurrentStep("otp");
                }}
              />
            </motion.div>
          )}

          {currentStep === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <OTPVerification
                onVerify={(phoneNumber) => {
                  updateFlowState({ phoneNumber });
                  setCurrentStep("valuation");
                }}
              />
            </motion.div>
          )}

          {currentStep === "valuation" && (
            <motion.div
              key="valuation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <FinalValuation
                finalPrice={flowState.finalPrice}
                deviceName={flowState.deviceName || ""}
                onContinue={() => setCurrentStep("pickup")}
              />
            </motion.div>
          )}

          {currentStep === "pickup" && flowState.phoneNumber && (
            <motion.div
              key="pickup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PickupScheduler
                flowState={flowState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
