import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import { DeviceCategory } from "@/pages/Index";
import { FlowState } from "@/pages/Index";
import { Loader2 } from "lucide-react";

interface ConditionPageProps {
  category: DeviceCategory;
}

const ConditionPage = ({ category }: ConditionPageProps) => {
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
      // No flow state, redirect to start
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
      return;
    }

    try {
      const parsedState = JSON.parse(storedFlowState);
      
      // Validate that variant is selected
      if (!parsedState.variantId || !parsedState.basePrice) {
        const categoryPath = category === "phone" ? "mobiles" : category;
        navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}/${citySlug}`);
        return;
      }
      
      console.log('🔍 ConditionPage loaded with flowState:', parsedState);
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
    }
  }, [navigate, category, brandSlug, deviceSlug, citySlug]);

  const handleComplete = (condition: any, finalPrice: number) => {
    console.log('✅ Condition questions completed:', { condition, finalPrice });

    // Update flowState with condition and final price
    const updatedFlowState = {
      ...flowState,
      condition,
      finalPrice,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    console.log('💾 Updated flowState saved to sessionStorage:', updatedFlowState);
    
    // Navigate to verification (OTP) page
    const categoryPath = category === "phone" ? "mobiles" : category;
    navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}/${citySlug}/${variantSlug}/verification`);
  };

  if (!flowState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <ConditionQuestions
          variantId={flowState.variantId!}
          basePrice={flowState.basePrice!}
          deviceName={flowState.deviceName || ""}
          releaseDate={flowState.releaseDate || ""}
          brandName={flowState.brandName || ""}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
};

export default ConditionPage;