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
}

const CitySelection = ({ onSelect }: Props) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching cities:", error);
      } else {
        setCities(data || []);
        setFilteredCities(data || []);
      }
      setLoading(false);
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(cities);
    } else {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, cities]);

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
        <h2 className="text-3xl font-bold mb-4">Select Your City</h2>
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
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredCities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => onSelect(city.id, city.name)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <span className="text-lg font-semibold">{city.name}</span>
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
