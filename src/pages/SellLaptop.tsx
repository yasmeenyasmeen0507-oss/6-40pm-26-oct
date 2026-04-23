import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import CitySelection from "@/components/sell-flow/CitySelection";
import LaptopVariantSelection from "@/components/sell-flow/LaptopVariantSelection";
import LaptopConditionQuestions from "@/components/sell-flow/LaptopConditionQuestions";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, TrendingUp, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  | "thankyou"
  | "pickup"
  | "success";

// Only Apple uses the FULL flow (Device → Variant → Condition → etc.)
// All other brands use SIMPLIFIED flow (Brand → City → OTP → Success)
const FULL_FLOW_BRANDS = ['Apple'];

// Helper to convert brand name to URL-friendly format
const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const SellLaptop = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("brand");
  const [useFullFlow, setUseFullFlow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Determine current step based on URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/sell/laptop') {
      setCurrentStep('brand');
    } else if (path.endsWith('/success')) {
      setCurrentStep('success');
    } else if (path.endsWith('/verify')) {
      setCurrentStep('otp');
    } else if (params.brandName) {
      // Check if brand uses full flow
      const isFullFlowBrand = FULL_FLOW_BRANDS.some(
        brand => slugify(brand) === params.brandName?.toLowerCase()
      );
      setUseFullFlow(isFullFlowBrand);
      
      if (!params.cityName) {
        // On brand page - determine next step
        if (isFullFlowBrand) {
          setCurrentStep('device');
        } else {
          setCurrentStep('city');
        }
      } else if (params.cityName && !path.includes('/verify') && !path.includes('/success')) {
        // Brand and city selected
        if (isFullFlowBrand) {
          setCurrentStep('variant');
        }
      }
    }
  }, [location.pathname, params]);

  // Confetti effect for valuation page
  useEffect(() => {
    if (currentStep === "thankyou") {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
          colors: ["#4169E1", "#3557C1", "#5B7FE8"],
        });
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
          colors: ["#4169E1", "#3557C1", "#5B7FE8"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const updateFlowState = (updates: Partial<LaptopFlowState>) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  // Submit lead for simplified flow (non-Apple brands)
  const submitLeadToLeadsTable = async (phoneNumber: string) => {
    console.log('Submitting lead with phone:', phoneNumber);
    console.log('Current flowState:', flowState);

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is missing",
        variant: "destructive",
      });
      return;
    }

    if (!flowState.brandName) {
      toast({
        title: "Error",
        description: "Brand name is missing",
        variant: "destructive",
      });
      return;
    }

    if (!flowState.cityId) {
      toast({
        title: "Error",
        description: "City information is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to leads table WITHOUT device_id and variant_id (simplified flow)
      console.log('Inserting lead into database (simplified flow - no device/variant)...');
      const leadData = {
        customer_name: 'To be provided',
        brand_name: flowState.brandName,
        phone_number: phoneNumber,
        verified_phone: phoneNumber,
        is_phone_verified: true,
        device_id: null,
        variant_id: null,
        city_id: flowState.cityId,
        final_price: null,
        condition: null,
        age_group: null,
        device_powers_on: null,
        display_condition: null,
        body_condition: null,
        can_make_calls: null,
        is_touch_working: null,
        is_screen_original: null,
        is_battery_healthy: null,
        has_charger: null,
        has_box: null,
        has_bill: null,
        overall_condition: null,
        lead_status: 'new',
        lead_notes: null,
        converted_to_pickup: false,
        pickup_request_id: null,
      };

      console.log('Lead data to insert:', leadData);

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Lead submitted successfully:', data);
      
      // Update state with phone number
      updateFlowState({ phoneNumber });
      
      // Set step to success FIRST before navigating
      setCurrentStep('success');
      
      // Navigate to success page
      const brandSlug = slugify(flowState.brandName);
      const citySlug = slugify(flowState.cityName || '');
      navigate(`/sell/laptop/${brandSlug}/${citySlug}/success`);
      
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit lead for full flow (Apple brands) - includes all details
  const submitAppleLeadToLeadsTable = async (phoneNumber: string) => {
    console.log('Submitting Apple lead with phone:', phoneNumber);
    console.log('Current flowState:', flowState);

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is missing",
        variant: "destructive",
      });
      return;
    }

    if (!flowState.brandName || !flowState.deviceId || !flowState.variantId) {
      toast({
        title: "Error",
        description: "Required information is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Inserting Apple lead into database (full flow with all details)...');
      const leadData = {
        customer_name: 'To be provided',
        brand_name: flowState.brandName,
        phone_number: phoneNumber,
        verified_phone: phoneNumber,
        is_phone_verified: true,
        device_id: flowState.deviceId,
        variant_id: flowState.variantId,
        city_id: flowState.cityId,
        final_price: flowState.finalPrice,
        condition: flowState.condition,
        age_group: flowState.ageRange,
        device_powers_on: null,
        display_condition: null,
        body_condition: null,
        can_make_calls: null,
        is_touch_working: null,
        is_screen_original: null,
        is_battery_healthy: null,
        has_charger: null,
        has_box: null,
        has_bill: null,
        overall_condition: flowState.condition,
        lead_status: 'new',
        lead_notes: `Device: ${flowState.deviceName}, Processor: ${flowState.processor}, RAM: ${flowState.ramGb}GB, Storage: ${flowState.storageGb}GB`,
        converted_to_pickup: false,
        pickup_request_id: null,
      };

      console.log('Apple lead data to insert:', leadData);

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Apple lead submitted successfully:', data);
      
      // Update state with phone number
      updateFlowState({ phoneNumber });
      
      // Move to thank you screen
      setCurrentStep("thankyou");
      
    } catch (error: any) {
      console.error('Error submitting Apple lead:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep === "brand") {
      navigate("/");
    } else if (currentStep === "device" && useFullFlow) {
      navigate("/sell/laptop");
      setCurrentStep("brand");
    } else if (currentStep === "city") {
      if (useFullFlow) {
        const brandSlug = slugify(flowState.brandName || '');
        navigate(`/sell/laptop/${brandSlug}`);
        setCurrentStep("device");
      } else {
        navigate("/sell/laptop");
        setCurrentStep("brand");
      }
    } else if (currentStep === "variant") {
      const brandSlug = slugify(flowState.brandName || '');
      navigate(`/sell/laptop/${brandSlug}`);
      setCurrentStep("city");
    } else if (currentStep === "condition") {
      const brandSlug = slugify(flowState.brandName || '');
      const citySlug = slugify(flowState.cityName || '');
      navigate(`/sell/laptop/${brandSlug}/${citySlug}`);
      setCurrentStep("variant");
    } else if (currentStep === "otp") {
      if (useFullFlow) {
        setCurrentStep("condition");
      } else {
        const brandSlug = slugify(flowState.brandName || '');
        navigate(`/sell/laptop/${brandSlug}`);
        setCurrentStep("city");
      }
    } else if (currentStep === "success" || currentStep === "thankyou") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const goHome = () => {
    navigate("/");
  };

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
                  console.log('Brand selected:', brandId, brandName);
                  updateFlowState({ brandId, brandName });
                  
                  // Check if this brand uses FULL flow (only Apple)
                  const isFullFlowBrand = FULL_FLOW_BRANDS.includes(brandName);
                  setUseFullFlow(isFullFlowBrand);
                  
                  // Update URL with brand slug
                  const brandSlug = slugify(brandName);
                  
                  if (isFullFlowBrand) {
                    // Apple: Go to Device Selection
                    navigate(`/sell/laptop/${brandSlug}`);
                    setCurrentStep("device");
                  } else {
                    // All other brands: Go directly to City Selection
                    navigate(`/sell/laptop/${brandSlug}`);
                    setCurrentStep("city");
                  }
                }}
              />
            </motion.div>
          )}

          {/* Full Flow Steps - ONLY for Apple */}
          {useFullFlow && currentStep === "device" && flowState.brandId && (
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
                  console.log('Device selected:', deviceId, deviceName);
                  updateFlowState({ deviceId, deviceName, releaseDate });
                  
                  // Move to city selection
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
                  console.log('City selected:', cityId, cityName);
                  console.log('useFullFlow:', useFullFlow);
                  console.log('flowState.deviceId:', flowState.deviceId);
                  
                  updateFlowState({ cityId, cityName });
                  
                  const brandSlug = slugify(flowState.brandName || '');
                  const citySlug = slugify(cityName);
                  
                  if (useFullFlow) {
                    // Apple: City → Variant (need device selected first)
                    if (!flowState.deviceId) {
                      console.error('Device ID missing for Apple flow!');
                      toast({
                        title: "Error",
                        description: "Please select a device first",
                        variant: "destructive",
                      });
                      return;
                    }
                    console.log('Navigating to variant selection...');
                    // Don't navigate - just change step to prevent URL change triggering useEffect
                    setCurrentStep("variant");
                  } else {
                    // Other brands: City → OTP → Success
                    navigate(`/sell/laptop/${brandSlug}/${citySlug}/verify`);
                    setCurrentStep("otp");
                  }
                }}
              />
            </motion.div>
          )}

          {useFullFlow && currentStep === "variant" && flowState.deviceId && (
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
                  console.log('Variant selected:', variantId);
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

          {useFullFlow && currentStep === "condition" && flowState.variantId && (
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
                  console.log('Condition questions complete:', { ageRange, condition, finalPrice });
                  updateFlowState({ ageRange, condition, finalPrice });
                  
                  const brandSlug = slugify(flowState.brandName || '');
                  const citySlug = slugify(flowState.cityName || '');
                  navigate(`/sell/laptop/${brandSlug}/${citySlug}/verify`);
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
                onVerify={async (phoneNumber, leadId) => {
                  console.log('OTP verified, phone:', phoneNumber);
                  console.log('Use full flow:', useFullFlow);
                  
                  if (useFullFlow) {
                    // Apple (Full flow): Submit lead with all details and go to Thank You screen
                    await submitAppleLeadToLeadsTable(phoneNumber);
                  } else {
                    // Other brands (Simplified flow): Submit basic lead and go to Success
                    await submitLeadToLeadsTable(phoneNumber);
                  }
                }}
              />
            </motion.div>
          )}

          {/* Valuation Screen - ONLY for Apple (Full Flow) - Exact UI from FinalValuation */}
          {useFullFlow && currentStep === "thankyou" && (
            <motion.div
              key="thankyou"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex p-6 rounded-full bg-[#4169E1]"
                >
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>

                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                  >
                    Congratulations! 🎉
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground"
                  >
                    Your {flowState.deviceName} is valued at
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  <Card className="border-4 border-[#4169E1]/30 shadow-2xl bg-gradient-to-br from-[#4169E1]/5 to-[#4169E1]/10">
                    <CardContent className="p-12">
                      <div className="text-6xl md:text-7xl font-bold text-[#4169E1] animate-pulse">
                        ₹{flowState.finalPrice.toLocaleString("en-IN")}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-[#4169E1]" />
                          <div className="text-left">
                            <h3 className="font-semibold text-sm">Best Value</h3>
                            <p className="text-xs text-muted-foreground">Competitive price</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-6 h-6 text-[#4169E1]" />
                          <div className="text-left">
                            <h3 className="font-semibold text-sm">100% Safe</h3>
                            <p className="text-xs text-muted-foreground">Secure transaction</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-[#4169E1]" />
                          <div className="text-left">
                            <h3 className="font-semibold text-sm">Quick Pickup</h3>
                            <p className="text-xs text-muted-foreground">Your convenience</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    size="lg"
                    onClick={() => setCurrentStep("pickup")}
                    className="bg-[#4169E1] hover:bg-[#3557C1] text-white px-12 py-6 text-lg"
                  >
                    Sell Now & Schedule Pickup
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {useFullFlow && currentStep === "pickup" && flowState.phoneNumber && (
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

          {/* Success Screen - ONLY for Simplified Flow (Non-Apple brands) */}
          {!useFullFlow && currentStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-green-100 rounded-full p-6">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  Thank You for Selling With Us!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-8"
                >
                  We have received your request. Our team will get in contact with you soon to discuss your <span className="font-semibold text-primary">{flowState.brandName}</span> laptop and provide you with the best quotation.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-6 mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Brand:</span>
                      <span className="text-gray-900 font-semibold">{flowState.brandName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">City:</span>
                      <span className="text-gray-900 font-semibold">{flowState.cityName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900 font-semibold">{flowState.phoneNumber}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-blue-800">
                    📞 Our team will call you within 24 hours to discuss your laptop details and provide a quotation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={goHome}
                    className="w-full py-6 text-lg font-semibold"
                    size="lg"
                  >
                    Back to Home
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-700">Submitting your request...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellLaptop;