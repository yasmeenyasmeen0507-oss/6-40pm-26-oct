import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("category", category)
        .order("name");

      if (error) {
        console.error("Error fetching brands:", error);
      } else {
        setBrands(data || []);
        setFilteredBrands(data || []);
      }
      setLoading(false);
    };

    fetchBrands();
  }, [category]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBrands(brands);
    } else {
      setFilteredBrands(
        brands.filter((brand) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, brands]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Select Your Brand</h2>
        <p className="text-muted-foreground">Choose the brand of your device</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredBrands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => onSelect(brand.id, brand.name)}
            >
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:ring-4 ring-primary/20 transition-all">
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
                <span className="font-semibold text-center">{brand.name}</span>
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
  );
};

export default BrandSelection;
