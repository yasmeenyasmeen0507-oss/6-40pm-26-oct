import { useNavigate } from "react-router-dom";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import { useEffect, useState } from "react";
import { FlowState } from "./Index";

const ValuationPage = () => {
  const navigate = useNavigate();
  const [flowState, setFlowState] = useState<FlowState | null>(null);

  useEffect(() => {
    // Get flowState from sessionStorage
    const storedFlowState = sessionStorage.getItem('flowState');
    
    if (!storedFlowState) {
      // If no data found, redirect to home
      navigate("/");
      return;
    }

    try {
      const parsedFlowState = JSON.parse(storedFlowState);
      setFlowState(parsedFlowState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleContinue = () => {
    // Navigate to pickup URL under the same category path
    const currentPath = window.location.pathname;
    const pickupPath = currentPath.replace('/valuation', '/pickup');
    navigate(pickupPath);
  };

  if (!flowState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <FinalValuation
          finalPrice={flowState.finalPrice}
          deviceName={flowState.deviceName || ""}
          onContinue={handleContinue}
        />
      </main>
    </div>
  );
};

export default ValuationPage;