import { useNavigate, useSearchParams } from "react-router-dom";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // ✅ Add loading spinner

const ConditionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get all params from URL
  const category = searchParams.get("category");
  const brandId = searchParams.get("brandId");
  const brandName = searchParams.get("brandName");
  const deviceId = searchParams.get("deviceId");
  const deviceName = searchParams.get("deviceName");
  const cityId = searchParams.get("cityId");
  const cityName = searchParams.get("cityName");
  const variantId = searchParams.get("variantId");
  const storageGb = searchParams.get("storageGb");
  const basePrice = searchParams.get("basePrice");

  // 🔍 DEBUG: Log all URL params
  console.log('🔍 ConditionPage URL params:', {
    category,
    brandId,
    brandName,
    deviceId,
    deviceName,
    cityId,
    cityName,
    variantId,
    storageGb,
    basePrice,
    fullURL: window.location.href
  });

  // Redirect if required params are missing
  useEffect(() => {
    if (!category || !brandId || !brandName || !deviceId || !deviceName || 
        !cityId || !cityName || !variantId || !storageGb || !basePrice) {
      console.error('❌ Missing required parameters, redirecting to home');
      navigate("/", { replace: true }); // ✅ Added replace: true to prevent back navigation
    }
  }, [category, brandId, brandName, deviceId, deviceName, cityId, cityName, variantId, storageGb, basePrice, navigate]);

  // Don't render if missing params
  if (!category || !brandId || !brandName || !deviceId || !deviceName || 
      !cityId || !cityName || !variantId || !storageGb || !basePrice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Missing Information</h2>
          <p className="text-muted-foreground">Required parameters are missing. Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleComplete = (condition: any, finalPrice: number) => {
    console.log('✅ Condition questions completed:', {
      condition,
      finalPrice
    });

    const params = new URLSearchParams({
      category,
      brandId,
      brandName,
      deviceId,
      deviceName,
      cityId,
      cityName,
      variantId,
      storageGb,
      basePrice,
      finalPrice: finalPrice.toString(),
      condition: JSON.stringify(condition),
    });

    console.log('🔄 Navigating to verify page with params:', params.toString());
    navigate(`/verify?${params.toString()}`);
  };

  return (
    <ConditionQuestions
      variantId={variantId}
      basePrice={parseFloat(basePrice)}
      deviceName={`${deviceName} ${storageGb}GB`}
      releaseDate=""
      onComplete={handleComplete}
    />
  );
};

export default ConditionPage;