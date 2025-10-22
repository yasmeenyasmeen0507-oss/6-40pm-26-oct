import { useNavigate, useSearchParams } from "react-router-dom";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { useEffect } from "react";
import { FlowState } from "@/pages/Index";

const PickupPage = () => {
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
  const finalPrice = searchParams.get("finalPrice");
  const phoneNumber = searchParams.get("phoneNumber");
  const condition = searchParams.get("condition");

  useEffect(() => {
    if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName || !variantId || !storageGb || !basePrice || !finalPrice || !phoneNumber || !condition) {
      navigate("/");
    }
  }, [category, brandId, brandName, deviceId, deviceName, cityId, cityName, variantId, storageGb, basePrice, finalPrice, phoneNumber, condition, navigate]);

  if (!category || !brandId || !brandName || !deviceId || !deviceName || !cityId || !cityName || !variantId || !storageGb || !basePrice || !finalPrice || !phoneNumber || !condition) return null;

  const flowState: FlowState = {
    category: category as any,
    brandId,
    brandName,
    deviceId,
    deviceName,
    releaseDate,
    cityId,
    cityName,
    variantId,
    storageGb: parseInt(storageGb),
    basePrice: parseFloat(basePrice),
    condition: JSON.parse(condition),
    phoneNumber,
    finalPrice: parseFloat(finalPrice),
  };

  return <PickupScheduler flowState={flowState} />;
};

export default PickupPage;
