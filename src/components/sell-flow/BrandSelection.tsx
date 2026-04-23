// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Home, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { DeviceCategory } from "@/pages/Index";

interface Props {
  category: DeviceCategory;
  onSelect: (brandId: string, brandName: string) => void;
}

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

const BrandSelection = ({ category, onSelect }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Define the custom brand order
  const BRAND_ORDER = [
    'Apple',
    'Xiaomi',
    'Samsung',
    'Vivo',
    'OnePlus',
    'OPPO',
    'Realme',
    'Motorola',
    'Lenovo',
    'Nokia',
    'Honor',
    'Google',
    'POCO',
    'Infinix',
    'Tecno',
    'iQOO',
    'Nothing'
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("category", category);

      if (error) {
        console.error("Error fetching brands:", error);
      } else {
        // Sort the data according to BRAND_ORDER
        const sortedData = [...(data || [])].sort((a, b) => {
          const aIndex = BRAND_ORDER.indexOf(a.name);
          const bIndex = BRAND_ORDER.indexOf(b.name);
          
          // If both brands are in the order list
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          // If only first brand is in the order list
          if (aIndex !== -1) return -1;
          
          // If only second brand is in the order list
          if (bIndex !== -1) return 1;
          
          // If neither brand is in the order list, sort alphabetically
          return a.name.localeCompare(b.name);
        });

        setBrands(sortedData);
        setFilteredBrands(sortedData);
      }
      setLoading(false);
    };

    fetchBrands();
  }, [category]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

  const processSteps = [
    { icon: DollarSign, title: "Check Price", description: "Get instant quote" },
    { icon: Calendar, title: "Schedule Pickup", description: "Choose your time" },
    { icon: CheckCircle, title: "Get Paid", description: "Receive payment" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Home Button */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2 text-black hover:text-black">
                <Home size={20} />
                Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span style={{ color: "#4169E1" }}>
                Sell Old {category === "phone" ? "Mobile Phone" : category === "laptop" ? "Laptop" : "Tablet"}
              </span> for Instant Cash
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Find your {category} model and get the best price instantly
            </p>
          </div>

          {/* Choose a Brand Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Choose a Brand</h2>
            
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:scale-105 transition-all duration-300 text-center p-6 border-2 hover:border-primary/50"
                    onClick={() => onSelect(brand.id, brand.name)}
                  >
                    <CardContent className="p-0">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        {brand.logo_url ? (
                          <img 
                            src={brand.logo_url} 
                            alt={brand.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {brand.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">{brand.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredBrands.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No brands found</p>
              </div>
            )}
          </div>

          {/* How Sell Kar Works */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-8">How Sell kar Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-black text-center">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-32 h-0.5 bg-primary/20 transform translate-x-8"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSelection;