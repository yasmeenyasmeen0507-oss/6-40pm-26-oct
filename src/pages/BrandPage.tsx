import { useNavigate, useSearchParams } from "react-router-dom";
import BrandSelection from "@/components/sell-flow/BrandSelection";
import { DeviceCategory } from "@/pages/Index";
import { useEffect } from "react";

const BrandPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") as DeviceCategory | null;

  useEffect(() => {
    if (!category) {
      navigate("/");
    }
  }, [category, navigate]);

  if (!category) return null;

  const handleSelect = (brandId: string, brandName: string) => {
    navigate(`/device?category=${category}&brandId=${brandId}&brandName=${encodeURIComponent(brandName)}`);
  };

  return <BrandSelection category={category} onSelect={handleSelect} />;
};

export default BrandPage;
