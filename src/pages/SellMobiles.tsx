import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import { FlowState } from "@/pages/Index";

const SellMobiles = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize flowState for new flow
    const flowState: FlowState = {
      category: "phone",
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
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(flowState));
  }, []);

  // Helper function to create URL-friendly slug
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleBrandSelect = (brandId: string, brandName: string) => {
    // Get current flow state
    const storedFlowState = sessionStorage.getItem("flowState");
    const flowState = storedFlowState ? JSON.parse(storedFlowState) : {};

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
    navigate(`/sell/mobiles/${brandSlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <BrandSelection category="phone" onSelect={handleBrandSelect} />
      </main>
    </div>
  );
};

export default SellMobiles;