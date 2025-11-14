import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import CategorySelection from "@/components/sell-flow/CategorySelection";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import CitySelection from "@/components/sell-flow/CitySelection";
import VariantSelection from "@/components/sell-flow/VariantSelection";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";

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

// ✅ FIXED: Updated condition interface to use snake_case (matches database)
export interface FlowState {
  category: DeviceCategory | null;
  brandId: string | null;
  brandName: string | null;
  deviceId: string | null;
  deviceName: string | null;
  releaseDate: string | null;
  cityId: string | null;
  cityName: string | null;
  variantId: string | null;
  storageGb: number | null;
  basePrice: number | null;
  condition: {
    can_make_calls: boolean;
    is_touch_working: boolean;
    is_screen_original: boolean;
    is_battery_healthy: boolean;
    overall_condition: string;
    age_group: string;
    has_charger: boolean;
    has_box: boolean;
    has_bill: boolean;
  } | null;
  phoneNumber: string | null;
  finalPrice: number;
}

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [flowState, setFlowState] = useState<FlowState>({
    category: null,
    brandId: null,
    brandName: null,
    deviceId: null,
    deviceName: null,
    releaseDate: null,
    cityId: null,
    cityName: null,
    variantId: null,
    storageGb: null,
    basePrice: null,
    condition: null,
    phoneNumber: null,
    finalPrice: 0,
  });

  useEffect(() => {
    if (location.state?.category) {
      setFlowState(prev => ({ ...prev, category: location.state.category }));
      setCurrentStep("brand");
    }
  }, [location.state]);

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

  const goHome = () => {
    navigate("/");
  };

  const canGoBack = currentStep !== "category" && currentStep !== "valuation" && currentStep !== "pickup";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
                onSelect={(deviceId, deviceName, releaseDate) => {
                  updateFlowState({ deviceId, deviceName, releaseDate });
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

          {currentStep === "condition" && flowState.basePrice !== null && flowState.variantId && (
            <motion.div
              key="condition"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ConditionQuestions
                variantId={flowState.variantId}
                basePrice={flowState.basePrice}
                deviceName={flowState.deviceName || ""}
                releaseDate={flowState.releaseDate || ""}
                brandName={flowState.brandName || ""}
                onComplete={(condition, finalPrice) => {
                  console.log("📦 Index received from ConditionQuestions:", { condition, finalPrice });
                  
                  updateFlowState({ condition, finalPrice });
                  
                  // ✅ Persist to sessionStorage immediately
                  const snapshot = {
                    ...flowState,
                    condition,
                    finalPrice,
                  };
                  sessionStorage.setItem("flowState", JSON.stringify(snapshot));
                  console.log("💾 Index saved to sessionStorage:", snapshot);
                  
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
                flowState={flowState}   
                onVerify={(phoneNumber) => {
                  updateFlowState({ phoneNumber });
                  
                  const completeFlowState = {
                    ...flowState,
                    phoneNumber: phoneNumber,
                  };
                  sessionStorage.setItem("flowState", JSON.stringify(completeFlowState));
                  
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