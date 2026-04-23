import { useNavigate } from "react-router-dom";
import CategorySelection from "@/components/sell-flow/CategorySelection";
import { DeviceCategory } from "@/pages/Index";

const CategoryPage = () => {
  const navigate = useNavigate();

  const handleSelect = (category: DeviceCategory) => {
    navigate(`/brand?category=${category}`);
  };

  return <CategorySelection onSelect={handleSelect} />;
};

export default CategoryPage;
