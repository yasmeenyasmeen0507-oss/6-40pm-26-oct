// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Apple custom sort order
const appleSortOrder = [
  "iphone 17 Pro max",
  "iphone 17 pro",
  "iphone 17",
  "iphone air",
  "iphone 16 pro max",
  "iphone 16 pro",
  "iphone 16 plus",
  "iphone 16",
  "iphone 16 e",
  "iphone 15 pro max",
  "iphone 15 pro",
  "iphone 15 plus",
  "iphone 15",
  "iphone 14 pro max",
  "iphone 14 pro",
  "iphone 14 plus",
  "iphone 14",
  "iphone 13 pro max",
  "iphone 13 pro",
  "iphone 13",
  "iphone 13 Mini",
  "iphone 12 Pro max",
  "iphone 12 pro",
  "iphone 12",
  "iphone 12 Mini",
  "iphone 11 pro max",
  "iphone 11 pro",
  "iphone 11",
  "iphone SE 2022",
  "iphone SE 2020",
  "iphone SE 1st Generation",
  "iphone XS Max",
  "iphone XS",
  "iphone XR",
  "iphone X",
  "iphone 8 Plus",
  "iphone 8",
  "iphone 7 plus",
  "iphone 7",
  "iphone 6s plus",
  "iphone 6S",
  "iphone 6 Plus",
  "iphone 6"
];

// Samsung series configuration
const samsungSeriesConfig = {
  "Galaxy S Series": [
    "Samsung Galaxy S25 Ultra 5G",
    "Samsung Galaxy S25 Plus 5G",
    "Samsung Galaxy S25 5G",
    "Samsung Galaxy S24 Ultra 5G",
    "Samsung Galaxy S24 Plus 5G",
    "Samsung Galaxy S24 FE 5G",
    "Samsung Galaxy S24 5G",
    "Samsung Galaxy S23 Ultra 5G",
    "Samsung Galaxy S23 Plus 5G",
    "Samsung Galaxy S23 FE 5G",
    "Samsung Galaxy S23 5G",
    "Samsung Galaxy S22 Ultra 5G",
    "Samsung Galaxy S22 Plus 5G",
    "Samsung Galaxy S22 5G",
    "Samsung Galaxy S21 Ultra",
    "Samsung Galaxy S21 Plus",
    "Samsung Galaxy S21 FE 5G",
    "Samsung Galaxy S21",
    "Samsung Galaxy S20 Ultra",
    "Samsung Galaxy S20 Plus",
    "Samsung Galaxy S20 FE 5G",
    "Samsung Galaxy S20 FE",
    "Samsung Galaxy S20",
    "Samsung Galaxy S10 Plus",
    "Samsung Galaxy S10e",
    "Samsung Galaxy S10 Lite",
    "Samsung Galaxy S10",
    "Samsung Galaxy S9 Plus",
    "Samsung Galaxy S9",
    "Samsung Galaxy S8 Plus",
    "Samsung Galaxy S8"
  ],
  "Galaxy Note Series": [
    "Samsung Galaxy Note 20 Ultra",
    "Samsung Galaxy Note 20",
    "Samsung Galaxy Note 10 Plus 5G",
    "Samsung Galaxy Note 10 Plus",
    "Samsung Galaxy Note 10 Lite",
    "Samsung Galaxy Note 10",
    "Samsung Galaxy Note 9",
    "Samsung Galaxy Note 8"
  ],
  "Galaxy Z Flip Series": [
    "Samsung Galaxy Z Flip 7 5G",
    "Samsung Galaxy Z Flip 6 5G",
    "Samsung Galaxy Z Flip 5",
    "Samsung Galaxy Z Flip 4",
    "Samsung Galaxy Z Flip 3 5G",
    "Samsung Galaxy Z Flip"
  ],
  "Galaxy Z Fold Series": [
    "Samsung Galaxy Z Fold 7",
    "Samsung Galaxy Z Fold 6",
    "Samsung Galaxy Z Fold 5",
    "Samsung Galaxy Z Fold 4",
    "Samsung Galaxy Z Fold 3 5G",
    "Samsung Galaxy Fold 2",
    "Samsung Galaxy Fold"
  ],
  "Galaxy A Series": [
    "Samsung Galaxy A55 5G",
    "Samsung Galaxy A54 5G",
    "Samsung Galaxy A53 5G",
    "Samsung Galaxy A52S",
    "Samsung Galaxy A52",
    "Samsung Galaxy A51",
    "Samsung Galaxy A50s",
    "Samsung Galaxy A50",
    "Samsung Galaxy A73 5G",
    "Samsung Galaxy A72",
    "Samsung Galaxy A71",
    "Samsung Galaxy A70",
    "Samsung Galaxy A35 5G",
    "Samsung Galaxy A34 5G",
    "Samsung Galaxy A33 5G",
    "Samsung Galaxy A32",
    "Samsung Galaxy A31",
    "Samsung Galaxy A30s",
    "Samsung Galaxy A30",
    "Samsung Galaxy A25 5G",
    "Samsung Galaxy A23",
    "Samsung Galaxy A22 5G",
    "Samsung Galaxy A22",
    "Samsung Galaxy A21s",
    "Samsung Galaxy A20s",
    "Samsung Galaxy A20",
    "Samsung Galaxy A15 5G",
    "Samsung Galaxy A14 5G",
    "Samsung Galaxy A13",
    "Samsung Galaxy A12",
    "Samsung Galaxy A10s",
    "Samsung Galaxy A10",
    "Samsung Galaxy A9 Pro",
    "Samsung Galaxy A9 2018",
    "Samsung Galaxy A80",
    "Samsung Galaxy A8 Star",
    "Samsung Galaxy A8 Plus",
    "Samsung Galaxy A7 2018",
    "Samsung Galaxy A6 Plus",
    "Samsung Galaxy A6",
    "Samsung Galaxy A04S",
    "Samsung Galaxy A04E",
    "Samsung Galaxy A04",
    "Samsung Galaxy A03s",
    "Samsung Galaxy A03"
  ],
  "Galaxy M Series": [
    "Samsung Galaxy M53 5G",
    "Samsung Galaxy M52 5G",
    "Samsung Galaxy M51",
    "Samsung Galaxy M42 5G",
    "Samsung Galaxy M40",
    "Samsung Galaxy M34 5G",
    "Samsung Galaxy M33 5G",
    "Samsung Galaxy M32 Prime Edition",
    "Samsung Galaxy M32 5G",
    "Samsung Galaxy M32",
    "Samsung Galaxy M31s",
    "Samsung Galaxy M31",
    "Samsung Galaxy M30s",
    "Samsung Galaxy M30",
    "Samsung Galaxy M21",
    "Samsung Galaxy M20",
    "Samsung Galaxy M15 5G",
    "Samsung Galaxy M14 5G",
    "Samsung Galaxy M13 5G",
    "Samsung Galaxy M13",
    "Samsung Galaxy M12",
    "Samsung Galaxy M11",
    "Samsung Galaxy M10s",
    "Samsung Galaxy M10",
    "Samsung Galaxy M02s",
    "Samsung Galaxy M02",
    "Samsung Galaxy M01s",
    "Samsung Galaxy M01"
  ]
};

const DeviceSelection = ({ brandId, onSelect }: Props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [groupedDevices, setGroupedDevices] = useState<Record<string, Device[]>>({});
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAppleBrand, setIsAppleBrand] = useState(false);
  const [isSamsungBrand, setIsSamsungBrand] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      
      const { data: brandData } = await supabase
        // @ts-expect-error
        .from("brands")
        .select("name")
        .eq("id", brandId)
        .single();
      
      const isApple = brandData?.name?.toLowerCase() === "apple";
      const isSamsung = brandData?.name?.toLowerCase() === "samsung";
      setIsAppleBrand(isApple);
      setIsSamsungBrand(isSamsung);

      // Build the query
      let query = supabase
        // @ts-expect-error
        .from("devices")
        .select("*")
        .eq("brand_id", brandId);

      // Only sort alphabetically if it's NOT Apple or Samsung
      if (!isApple && !isSamsung) {
        query = query.order("model_name");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
        setFilteredDevices([]);
        setGroupedDevices({});
      } else {
        let finalData = data || [];

        // Apply custom sort logic for Apple
        if (isApple) {
          // Normalize the sort order list to lowercase once
          const normalizedAppleSortOrder = appleSortOrder.map(name => name.toLowerCase());

          const getSortIndex = (modelName: string) => {
            // Normalize the device model name to lowercase for case-insensitive lookup
            const normalizedModelName = modelName.toLowerCase();
            const index = normalizedAppleSortOrder.indexOf(normalizedModelName);
            return index === -1 ? normalizedAppleSortOrder.length : index;
          };
          finalData.sort((a, b) => getSortIndex(a.model_name) - getSortIndex(b.model_name));
        }
        
        // Group Samsung devices by series
        if (isSamsung) {
          const grouped: Record<string, Device[]> = {};
          
          // Initialize all series
          Object.keys(samsungSeriesConfig).forEach(seriesName => {
            grouped[seriesName] = [];
          });
          
          // Categorize each device
          finalData.forEach(device => {
            let categorized = false;
            
            // Check which series this device belongs to
            for (const [seriesName, modelList] of Object.entries(samsungSeriesConfig)) {
              if (modelList.includes(device.model_name)) {
                grouped[seriesName].push(device);
                categorized = true;
                break;
              }
            }
          });
          
          // Sort devices within each series according to the order
          Object.keys(samsungSeriesConfig).forEach(seriesName => {
            const modelOrder = samsungSeriesConfig[seriesName as keyof typeof samsungSeriesConfig];
            grouped[seriesName].sort((a, b) => {
              const indexA = modelOrder.indexOf(a.model_name);
              const indexB = modelOrder.indexOf(b.model_name);
              return indexA - indexB;
            });
          });
          
          // Remove empty series
          Object.keys(grouped).forEach(key => {
            if (grouped[key].length === 0) {
              delete grouped[key];
            }
          });
          
          setGroupedDevices(grouped);
        }
        
        setDevices(finalData);
        setFilteredDevices(finalData);
      }
      setLoading(false);
    };

    fetchDevices();
  }, [brandId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (selectedSeries && isSamsungBrand) {
        setFilteredDevices(groupedDevices[selectedSeries] || []);
      } else {
        setFilteredDevices(devices);
      }
    } else {
      const devicesToFilter = selectedSeries && isSamsungBrand 
        ? (groupedDevices[selectedSeries] || [])
        : devices;
      
      setFilteredDevices(
        devicesToFilter.filter((device) =>
          device.model_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, devices, selectedSeries, isSamsungBrand, groupedDevices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Samsung: Show series selection screen
  if (isSamsungBrand && !selectedSeries) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in-up px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Select <span className="text-[#4169E1]">Series</span>
          </h2>
          <p className="text-muted-foreground">Choose your device series</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.keys(groupedDevices).map((seriesName, index) => (
            <motion.div
              key={seriesName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-20 text-base font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => setSelectedSeries(seriesName)}
              >
                {seriesName}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up px-4">
      <div className="text-center mb-8">
        {isSamsungBrand && selectedSeries && (
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              setSelectedSeries(null);
              setSearchQuery("");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Series Selection
          </Button>
        )}
        <h2 className="text-3xl font-bold mb-4">
          {isSamsungBrand && selectedSeries ? (
            <>Select Your <span className="text-[#4169E1]">{selectedSeries}</span> Model</>
          ) : (
            <>Select Your <span className="text-[#4169E1]">Device</span> Model</>
          )}
        </h2>
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

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.01, 0.3) }}
            className="h-full"
          >
            <Card
              className="h-full cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => onSelect(device.id, device.model_name, device.release_date)}
            >
              <CardContent className="p-3 flex flex-col h-full">
                {/* Fixed height image container and placeholder */}
                <div className="mb-2 overflow-hidden rounded-md flex-shrink-0 w-full h-24 md:h-28 bg-gray-100 flex items-center justify-center">
                  {device.image_url ? (
                    <img
                      src={device.image_url}
                      alt={device.model_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">No Image</span>
                  )}
                </div>
                <h3 className="font-medium text-xs md:text-sm mb-1 line-clamp-2">
                  {device.model_name}
                </h3>
                {!isAppleBrand && !isSamsungBrand && device.series && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-auto">
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
