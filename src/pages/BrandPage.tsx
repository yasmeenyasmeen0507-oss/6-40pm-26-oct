import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import { DeviceCategory } from "@/pages/Index";
import { FlowState } from "@/pages/Index";

interface BrandPageProps {
  category: DeviceCategory;
}

// Helper function to create URL-friendly slug
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const BrandPage = ({ category }: BrandPageProps) => {
  const navigate = useNavigate();
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
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
    }
  }, [navigate, category]);

  const handleSelect = (brandId: string, brandName: string) => {
    // Update flowState with selected brand
    const updatedFlowState = {
      ...flowState,
      brandId,
      brandName,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    
    // Create slug from brand name
    const brandSlug = createSlug(brandName);
    
    // Navigate to device selection with brand in URL
    const categoryPath = category === "phone" ? "mobiles" : category;
    navigate(`/sell/${categoryPath}/brand/${brandSlug}/device`);
  };

  if (!flowState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <BrandSelection category={category} onSelect={handleSelect} />
      </main>
    </div>
  );
};

export default BrandPage;