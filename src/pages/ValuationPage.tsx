import { useNavigate, useParams, useLocation } from "react-router-dom";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import { useEffect, useState } from "react";
import { FlowState } from "./Index";

const ValuationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandSlug, deviceSlug, citySlug, variantSlug } = useParams<{ 
    brandSlug?: string; 
    deviceSlug?: string; 
    citySlug?: string;
    variantSlug?: string;
  }>();
  
  const [flowState, setFlowState] = useState<FlowState | null>(null);

  // ✅ Restore flowState from sessionStorage (for refresh)
  useEffect(() => {
    const storedFlowState = sessionStorage.getItem('flowState');
    
    if (!storedFlowState) {
      console.warn("⚠️ No flowState found, redirecting to home");
      navigate("/");
      return;
    }

    try {
      const parsedFlowState = JSON.parse(storedFlowState);
      console.log("🔄 ValuationPage: Restored flowState:", parsedFlowState);
      setFlowState(parsedFlowState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      navigate("/");
    }
  }, [navigate]);

  // ✅ Handle back button - redirect to home
  useEffect(() => {
    // Push a state to mark we're on valuation page
    window.history.pushState({ page: 'valuation' }, '', window.location.pathname);

    const handlePopState = (event: PopStateEvent) => {
      console.log("🔙 Back button pressed on valuation page");
      
      // Prevent default back behavior
      event.preventDefault();
      window.history.pushState({ page: 'valuation' }, '', window.location.pathname);
      
      // Clear session and navigate to home
      sessionStorage.removeItem("flowState");
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleContinue = () => {
    // Check if we have slugs in URL (coming from verification/success route)
    if (brandSlug && deviceSlug && citySlug && variantSlug) {
      // Navigate to pickup with full URL path preserved
      const currentPath = location.pathname;
      const pickupPath = `${currentPath}/pickup`;
      navigate(pickupPath);
    } else {
      // Fallback (shouldn't happen)
      navigate("/");
    }
  };

  if (!flowState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading valuation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <FinalValuation
          finalPrice={flowState.finalPrice}
          deviceName={flowState.deviceName || "Your Device"}
          onContinue={handleContinue}
        />
      </main>
    </div>
  );
};

export default ValuationPage;