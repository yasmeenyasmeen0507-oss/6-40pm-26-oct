// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  brandId: string;
  onSelect: (deviceId: string, deviceName: string, releaseDate: string | null) => void;
}

interface Device {
  id: string;
  model_name: string;
  series: string | null;
  release_date: string | null;
  image_url: string | null;
}

const DeviceSelection = ({ brandId, onSelect }: Props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAppleBrand, setIsAppleBrand] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      
      // Fetch brand to check if it's Apple
      const { data: brandData } = await supabase
        // @ts-expect-error - Supabase types are regenerating after migration
        .from("brands")
        .select("name")
        .eq("id", brandId)
        .single();
      
      setIsAppleBrand(brandData?.name?.toLowerCase() === "apple");

      const { data, error } = await supabase
        // @ts-expect-error - Supabase types are regenerating after migration
        .from("devices")
        .select("*")
        .eq("brand_id", brandId)
        .order("model_name");

      if (error) {
        console.error("Error fetching devices:", error);
      } else {
        setDevices(data || []);
        setFilteredDevices(data || []);
      }
      setLoading(false);
    };

    fetchDevices();
  }, [brandId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDevices(devices);
    } else {
      setFilteredDevices(
        devices.filter((device) =>
          device.model_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, devices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Select Your Device Model</h2>
        <p className="text-muted-foreground">Choose your specific device model</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      {/* Grid: 3 columns mobile, 6 columns desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => onSelect(device.id, device.model_name, device.release_date)}
            >
              <CardContent className="p-3">
                {/* Device Image - No background */}
                {device.image_url && (
                  <div className="mb-2 overflow-hidden rounded-md">
                    <img
                      src={device.image_url}
                      alt={device.model_name}
                      className="w-full h-24 md:h-28 object-contain"
                    />
                  </div>
                )}
                
                {/* Model Name */}
                <h3 className="font-medium text-xs md:text-sm mb-1 line-clamp-2">
                  {device.model_name}
                </h3>
                
                {/* Series - Only show for non-Apple devices */}
                {!isAppleBrand && device.series && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {device.series}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No devices found</p>
        </div>
      )}
    </div>
  );
};

export default DeviceSelection;