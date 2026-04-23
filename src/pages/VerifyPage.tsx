import { useNavigate, useParams } from "react-router-dom";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import { useEffect, useState } from "react";
import { FlowState } from "@/pages/Index";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { brandSlug, deviceSlug, citySlug, variantSlug } = useParams<{ 
    brandSlug: string; 
    deviceSlug: string; 
    citySlug: string;
    variantSlug: string;
  }>();
  
  const [flowState, setFlowState] = useState<FlowState | null>(null);

  useEffect(() => {
    // Get flowState from sessionStorage
    const storedFlowState = sessionStorage.getItem("flowState");
    
    if (!storedFlowState) {
      // No flow state, redirect to home
      navigate("/");
      return;
    }

    try {
      const parsedState = JSON.parse(storedFlowState);
      
      // Validate that condition is completed
      if (!parsedState.variantId || !parsedState.finalPrice) {
        navigate("/");
        return;
      }
      
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleVerify = (phoneNumber: string, leadId: string) => {
    console.log("✅ OTP Verified! Phone:", phoneNumber, "Lead ID:", leadId);
    
    // Update flowState with phone number
    const updatedFlowState = {
      ...flowState,
      phoneNumber,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    
    // Determine category path
    const category = flowState?.category || "phone";
    const categoryPath = category === "phone" ? "mobiles" : category;
    
    console.log("🚀 Navigating to verification/success...");
    
    // Navigate directly to verification success (which shows ValuationPage)
    navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}/${citySlug}/${variantSlug}/verification/success`, { replace: true });
  };

  if (!flowState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ONLY show OTP verification form - NO success message here
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <OTPVerification
          flowState={flowState}
          onVerify={handleVerify}
        />
      </main>
    </div>
  );
};

export default VerifyPage;