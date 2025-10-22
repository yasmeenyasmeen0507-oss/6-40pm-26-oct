import { useNavigate, useSearchParams } from "react-router-dom";
import FinalValuation from "@/components/sell-flow/FinalValuation";
import { useEffect } from "react";

const ValuationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const finalPrice = searchParams.get("finalPrice");
  const deviceName = searchParams.get("deviceName");
  const phoneNumber = searchParams.get("phoneNumber");

  useEffect(() => {
    if (!finalPrice || !deviceName || !phoneNumber) {
      navigate("/");
    }
  }, [finalPrice, deviceName, phoneNumber, navigate]);

  if (!finalPrice || !deviceName || !phoneNumber) return null;

  const handleContinue = () => {
    navigate(`/pickup?${searchParams.toString()}`);
  };

  return (
    <FinalValuation
      finalPrice={parseFloat(finalPrice)}
      deviceName={deviceName}
      onContinue={handleContinue}
    />
  );
};

export default ValuationPage;
