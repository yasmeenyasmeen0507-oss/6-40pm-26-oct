// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Props {
  brandId: string;
  onSelect: (deviceId: string, deviceName: string) => void;
}

interface Device {
  id: string;
  model_name: string;
  series: string | null;
}

const DeviceSelection = ({ brandId, onSelect }: Props) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        // @ts-expect-error - Supabase types are regenerating after migration
        .from("devices")
        .select("*")
        .eq("brand_id", brandId)
        .order("series")
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
          device.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (device.series && device.series.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [searchQuery, devices]);

  // Group devices by series
  const devicesBySeries = filteredDevices.reduce((acc, device) => {
    const series = device.series || "Other Models";
    if (!acc[series]) {
      acc[series] = [];
    }
    acc[series].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

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

      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(devicesBySeries).map(([series, seriesDevices], seriesIndex) => (
          <AccordionItem
            key={series}
            value={series}
            className="border rounded-lg bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <span className="text-lg font-semibold">{series}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid md:grid-cols-2 gap-3 pt-2">
                {seriesDevices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 border-2 hover:border-primary/50"
                      onClick={() => onSelect(device.id, device.model_name)}
                    >
                      <CardContent className="p-4">
                        <span className="font-medium">{device.model_name}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No devices found</p>
        </div>
      )}
    </div>
  );
};

export default DeviceSelection;
