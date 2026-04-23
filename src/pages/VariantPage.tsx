import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VariantSelection from "@/components/sell-flow/VariantSelection";
import { DeviceCategory } from "@/pages/Index";
import { FlowState } from "@/pages/Index";

interface VariantPageProps {
  category: DeviceCategory;
}

const VariantPage = ({ category }: VariantPageProps) => {
  const navigate = useNavigate();
  const { brandSlug, deviceSlug, citySlug } = useParams<{ brandSlug: string; deviceSlug: string; citySlug: string }>();
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
      
      // Validate that city is selected
      if (!parsedState.cityId) {
        const categoryPath = category === "phone" ? "mobiles" : category;
        navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}`);
        return;
      }
      
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
    }
  }, [navigate, category, brandSlug, deviceSlug]);

  const handleSelect = (variantId: string, storageGb: number | string, basePrice: number) => {
    console.log('🔍 RAW Variant data received:', { variantId, storageGb, basePrice, type: typeof storageGb });
    
    // Create slug from variant (storage)
    let variantSlug: string;
    let cleanStorageValue: number;
    
    // Convert to string first
    const storageStr = String(storageGb);
    
    // If it contains a slash (like "6/128GB"), extract the storage part after slash
    if (storageStr.includes('/')) {
      const parts = storageStr.split('/');
      const storagePart = parts[1] || parts[0]; // Get "128GB" from "6/128GB"
      cleanStorageValue = parseInt(storagePart.replace(/\D/g, ''));
      // Create slug with dash instead of slash: "6-128gb"
      const ramPart = parts[0].replace(/\D/g, '');
      variantSlug = `${ramPart}-${cleanStorageValue}gb`;
    } else {
      // Remove any non-numeric characters
      cleanStorageValue = parseInt(storageStr.replace(/\D/g, ''));
      variantSlug = `${cleanStorageValue}gb`;
    }
    
    console.log('🔍 Processed variant:', { 
      original: storageGb,
      cleaned: cleanStorageValue,
      slug: variantSlug
    });
    
    // Update flowState with selected variant (store the original value)
    const updatedFlowState = {
      ...flowState,
      variantId,
      storageGb: storageGb, // Keep original format for display
      basePrice,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    
    console.log('💾 Saved flowState:', updatedFlowState);
    
    // Navigate to condition questions
    const categoryPath = category === "phone" ? "mobiles" : category;
    const targetPath = `/sell/${categoryPath}/${brandSlug}/${deviceSlug}/${citySlug}/${variantSlug}`;
    
    console.log('🚀 Navigating to:', targetPath);
    navigate(targetPath);
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
        <VariantSelection deviceId={flowState.deviceId!} onSelect={handleSelect} />
      </main>
    </div>
  );
};

export default VariantPage;