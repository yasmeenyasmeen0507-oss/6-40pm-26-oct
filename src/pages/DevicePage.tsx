import { useNavigate, useSearchParams } from "react-router-dom";
import DeviceSelection from "@/components/sell-flow/DeviceSelection";
import { useEffect } from "react";

const DevicePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const brandId = searchParams.get("brandId");
  const brandName = searchParams.get("brandName");

  useEffect(() => {
    if (!category || !brandId || !brandName) {
      navigate("/");
    }
  }, [category, brandId, brandName, navigate]);

  if (!category || !brandId || !brandName) return null;

  const handleSelect = (deviceId: string, deviceName: string, releaseDate: string | null) => {
    const params = new URLSearchParams({
      category,
      brandId,
      brandName,
      deviceId,
      deviceName,
    });
    if (releaseDate) params.append("releaseDate", releaseDate);
    navigate(`/city?${params.toString()}`);
  };

  return <DeviceSelection brandId={brandId} onSelect={handleSelect} />;
};

export default DevicePage;
