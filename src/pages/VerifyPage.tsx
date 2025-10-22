import { useNavigate, useSearchParams } from "react-router-dom";
import OTPVerification from "@/components/sell-flow/OTPVerification";
import { useEffect } from "react";

const VerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requiredParams = ["category", "brandId", "brandName", "deviceId", "deviceName", "cityId", "cityName", "variantId", "storageGb", "basePrice", "finalPrice", "condition"];
    const hasAllParams = requiredParams.every(param => searchParams.get(param));

    if (!hasAllParams) {
      navigate("/");
    }
  }, [searchParams, navigate]);

  const handleVerify = (phoneNumber: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("phoneNumber", phoneNumber);
    navigate(`/valuation?${params.toString()}`);
  };

  return <OTPVerification onVerify={handleVerify} />;
};

export default VerifyPage;
