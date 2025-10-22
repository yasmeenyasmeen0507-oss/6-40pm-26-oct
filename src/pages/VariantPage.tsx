import { useNavigate, useSearchParams } from "react-router-dom";
import VariantSelection from "@/components/sell-flow/VariantSelection";
import { useEffect } from "react";

const VariantPage = () => {
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

  useEffect(() => {
    if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName) {
      navigate("/");
    }
  }, [category, brandId, brandName, deviceId, deviceName, cityId, cityName, navigate]);

  if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName) return null;

  const handleSelect = (variantId: string, storageGb: number, basePrice: number) => {
    const params = new URLSearchParams({
      category,
      brandId,
      brandName,
      deviceId,
      deviceName,
      cityId,
      cityName,
      variantId,
      storageGb: storageGb.toString(),
      basePrice: basePrice.toString(),
    });
    if (releaseDate) params.append("releaseDate", releaseDate);
    navigate(`/condition?${params.toString()}`);
  };

  return <VariantSelection deviceId={deviceId} onSelect={handleSelect} />;
};

export default VariantPage;
