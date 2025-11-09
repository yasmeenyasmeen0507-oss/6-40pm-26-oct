import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import CitySelection from "@/components/sell-flow/CitySelection";
import LaptopVariantSelection from "@/components/sell-flow/LaptopVariantSelection";
import LaptopConditionQuestions from "@/components/sell-flow/LaptopConditionQuestions";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";

export interface LaptopFlowState {
  category: string;
  brandId: string | null;
  brandName: string | null;
  deviceId: string | null;
  deviceName: string | null;
  releaseDate: string | null;
  cityId: string | null;
  cityName: string | null;
  variantId: string | null;
  processor: string | null;
  ramGb: number | null;
  storageGb: number | null;
  screenSize: string | null;
  basePrice: number | null;
  ageRange: string | null;
  condition: string | null;
  phoneNumber: string | null;
  finalPrice: number;
}

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
  const [flowState, setFlowState] = useState<LaptopFlowState>({
    category: "laptop",
    brandId: null,
    brandName: null,
    deviceId: null,
    deviceName: null,
    releaseDate: null,
    cityId: null,
    cityName: null,
    variantId: null,
    processor: null,
    ramGb: null,
    storageGb: null,
    screenSize: null,
    basePrice: null,
    ageRange: null,
    condition: null,
    phoneNumber: null,
    finalPrice: 0,
  });

  const updateFlowState = (updates: Partial<LaptopFlowState>) => {
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
              <LaptopVariantSelection
                deviceId={flowState.deviceId}
                deviceName={flowState.deviceName || ""}
                onSelect={(variantId, processor, ramGb, storageGb, screenSize) => {
                  updateFlowState({ 
                    variantId, 
                    processor, 
                    ramGb, 
                    storageGb, 
                    screenSize 
                  });
                  setCurrentStep("condition");
                }}
              />
            </motion.div>
          )}

          {currentStep === "condition" && flowState.variantId && (
            <motion.div
              key="condition"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <LaptopConditionQuestions
                variantId={flowState.variantId}
                deviceName={flowState.deviceName || ""}
                brandName={flowState.brandName || ""}
                onComplete={(ageRange, condition, finalPrice) => {
                  updateFlowState({ ageRange, condition, finalPrice });
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