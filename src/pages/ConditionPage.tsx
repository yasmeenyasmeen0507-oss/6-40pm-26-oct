import { useNavigate, useSearchParams } from "react-router-dom";
import ConditionQuestions from "@/components/sell-flow/ConditionQuestions";
import { useEffect } from "react";

const ConditionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const brandId = searchParams.get("brandId");
  const brandName = searchParams.get("brandName");
  const deviceId = searchParams.get("deviceId");
  const deviceName = searchParams.get("deviceName");
  const releaseDate = searchParams.get("releaseDate");
  const cityId = searchParams.get("cityId");
  const cityName = searchParams.get("cityName");
  const variantId = searchParams.get("variantId");
  const storageGb = searchParams.get("storageGb");
  const basePrice = searchParams.get("basePrice");

  useEffect(() => {
    if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName || !variantId || !storageGb || !basePrice) {
      navigate("/");
    }
  }, [category, brandId, brandName, deviceId, deviceName, cityId, cityName, variantId, storageGb, basePrice, navigate]);

  if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName || !variantId || !storageGb || !basePrice) return null;

  const handleComplete = (condition: any, finalPrice: number) => {
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
    if (releaseDate) params.append("releaseDate", releaseDate);
    navigate(`/verify?${params.toString()}`);
  };

  return (
    <ConditionQuestions
      basePrice={parseFloat(basePrice)}
      deviceName={deviceName}
      releaseDate={releaseDate || ""}
      onComplete={handleComplete}
    />
  );
};

export default ConditionPage;
