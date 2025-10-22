import { useNavigate, useSearchParams } from "react-router-dom";
import CitySelection from "@/components/sell-flow/CitySelection";
import { useEffect } from "react";

const CityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const brandId = searchParams.get("brandId");
  const brandName = searchParams.get("brandName");
  const deviceId = searchParams.get("deviceId");
  const deviceName = searchParams.get("deviceName");
  const releaseDate = searchParams.get("releaseDate");

  useEffect(() => {
    if (!category || !brandId || !brandName || !deviceId || !deviceName) {
      navigate("/");
    }
  }, [category, brandId, brandName, deviceId, deviceName, navigate]);

  if (!category || !brandId || !brandName || !deviceId || !deviceName) return null;

  const handleSelect = (cityId: string, cityName: string) => {
    const params = new URLSearchParams({
      category,
      brandId,
      brandName,
      deviceId,
      deviceName,
      cityId,
      cityName,
    });
    if (releaseDate) params.append("releaseDate", releaseDate);
    navigate(`/variant?${params.toString()}`);
  };

  return <CitySelection onSelect={handleSelect} />;
};

export default CityPage;
