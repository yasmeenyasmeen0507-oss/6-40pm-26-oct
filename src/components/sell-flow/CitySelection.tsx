// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onSelect: (cityId: string, cityName: string) => void;
}

interface City {
  id: string;
  name: string;
  icon_url: string | null;
}

const CitySelection = ({ onSelect }: Props) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Define the custom city order
  const CITY_ORDER = [
    'BANGALORE',
    'DELHI',
    'MUMBAI',
    'CHENNAI',
    'HYDERABAD',
    'THANE',
    'JAIPUR',
    'PUNE',
    'AGRA',
    'KOLKATA',
    'GORAKHPUR',
    'MATHURA',
    'BANARAS',
    'LUCKNOW',
    'KANPUR',
    'CHANDIGARH',
    'AMRITSAR',
    'LUDHIANA',
    'PATNA',
    'My city is not listed' // Single option for unlisted cities
  ];

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cities")
        .select("*");

      if (error) {
        console.error("Error fetching cities:", error);
      } else {
        // Sort the data according to CITY_ORDER
        const sortedData = [...(data || [])].sort((a, b) => {
          const aIndex = CITY_ORDER.indexOf(a.name.toUpperCase());
          const bIndex = CITY_ORDER.indexOf(b.name.toUpperCase());
          
          // If both cities are in the order list
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          // If only first city is in the order list
          if (aIndex !== -1) return -1;
          
          // If only second city is in the order list
          if (bIndex !== -1) return 1;
          
          // If neither city is in the order list, sort alphabetically
          return a.name.localeCompare(b.name);
        });

        setCities(sortedData);
        setFilteredCities(sortedData);
      }
      setLoading(false);
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, cities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Select Your <span style={{ color: "#4169E1" }}>City</span>
        </h2>
        <p className="text-muted-foreground">Where should we pick up your device?</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-[#4169E1] group"
              onClick={() => onSelect(city.id, city.name)}
            >
              <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4169E1]/10 group-hover:bg-[#4169E1]/20 flex items-center justify-center overflow-hidden transition-colors duration-300 flex-shrink-0">
                  {city.icon_url ? (
                    <img 
                      src={city.icon_url} 
                      alt={city.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#4169E1]" />
                  )}
                </div>
                <span className="text-sm sm:text-lg font-semibold group-hover:text-[#4169E1] transition-colors duration-300">
                  {city.name}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No cities found</p>
        </div>
      )}
    </div>
  );
};

export default CitySelection;