import { useNavigate, useSearchParams } from "react-router-dom";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { useEffect, useState } from "react";
import { FlowState } from "@/pages/Index";

const PickupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [flowState, setFlowState] = useState<FlowState | null>(null);

  useEffect(() => {
    // Check if coming from success redirect (has status param)
    const status = searchParams.get("status");
    if (status === "success") {
      // Allow showing success page even without flowState
      const storedFlowState = sessionStorage.getItem('flowState');
      if (storedFlowState) {
        try {
          setFlowState(JSON.parse(storedFlowState));
        } catch (error) {
          console.error("Error parsing flowState:", error);
        }
      }
      return;
    }

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
  }, [navigate, searchParams]);

  if (!flowState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <PickupScheduler flowState={flowState} />
      </main>
    </div>
  );
};

export default PickupPage;