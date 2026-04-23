import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CitySelection from "@/components/sell-flow/CitySelection";
import { DeviceCategory } from "@/pages/Index";
import { FlowState } from "@/pages/Index";

interface CityPageProps {
  category: DeviceCategory;
}

// Helper function to create URL-friendly slug
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const CityPage = ({ category }: CityPageProps) => {
  const navigate = useNavigate();
  const { brandSlug, deviceSlug } = useParams<{ brandSlug: string; deviceSlug: string }>();
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
      
      // Validate that device is selected
      if (!parsedState.deviceId) {
        const categoryPath = category === "phone" ? "mobiles" : category;
        navigate(`/sell/${categoryPath}/${brandSlug}`);
        return;
      }
      
      setFlowState(parsedState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      const categoryPath = category === "phone" ? "mobiles" : category;
      navigate(`/sell/${categoryPath}`);
    }
  }, [navigate, category, brandSlug]);

  const handleSelect = (cityId: string, cityName: string) => {
    // Update flowState with selected city
    const updatedFlowState = {
      ...flowState,
      cityId,
      cityName,
    };
    
    sessionStorage.setItem("flowState", JSON.stringify(updatedFlowState));
    
    // Create slug from city name
    const citySlug = createSlug(cityName);
    
    // Navigate to variant selection
    const categoryPath = category === "phone" ? "mobiles" : category;
    navigate(`/sell/${categoryPath}/${brandSlug}/${deviceSlug}/${citySlug}`);
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
        <CitySelection onSelect={handleSelect} />
      </main>
    </div>
  );
};

export default CityPage;