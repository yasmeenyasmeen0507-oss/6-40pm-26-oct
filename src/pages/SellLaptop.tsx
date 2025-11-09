import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import CitySelection from "@/components/sell-flow/CitySelection";
import VariantSelection from "@/components/sell-flow/VariantSelection";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { FlowState } from "./Index";

type Step = 
  | "brand" 
  | "device" 
  | "city" 
  | "variant" 
  | "condition" 
  | "otp" 
  | "valuation" 
  | "pickup";

const SellLaptop = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("brand");
  const [flowState, setFlowState] = useState<FlowState>({
    category: "laptop",
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

  const updateFlowState = (updates: Partial<FlowState>) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  const goBack = () => {
    const stepOrder: Step[] = ["brand", "device", "city", "variant", "condition", "otp", "valuation", "pickup"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      navigate("/");
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const canGoBack = currentStep !== "valuation" && currentStep !== "pickup";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === "brand" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <BrandSelection
                category="laptop"
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
                onVerify={(phoneNumber, leadId) => {
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

export default SellLaptop;