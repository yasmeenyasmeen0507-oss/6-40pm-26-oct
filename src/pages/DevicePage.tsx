import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import { DeviceCategory } from "@/pages/Index";
import { FlowState } from "@/pages/Index";

interface DevicePageProps {
  category: DeviceCategory;
}

// Helper function to create URL-friendly slug
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const DevicePage = ({ category }: DevicePageProps) => {
  const navigate = useNavigate();
  const { brandSlug } = useParams<{ brandSlug: string }>();
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
      
      // Validate that brand is selected
      if (!parsedState.brandId) {
        const categoryPath = category === "phone" ? "mobiles" : category;
        navigate(`/sell/${categoryPath}`);
        return;
      }
      
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
    }
  }, [navigate, category]);

  const handleSelect = (deviceId: string, deviceName: string, releaseDate: string | null) => {
    // Update flowState with selected device
    const updatedFlowState = {
      ...flowState,
      deviceId,
      deviceName,
      releaseDate,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    
    // Create slug from device name
    const deviceSlug = createSlug(deviceName);
    
    // Navigate to city selection with brand and device in URL
    const categoryPath = category === "phone" ? "mobiles" : category;
    navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}`);
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
        <DeviceSelection brandId={flowState.brandId!} onSelect={handleSelect} />
      </main>
    </div>
  );
};

export default DevicePage;