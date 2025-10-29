// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  deviceId: string;
  deviceName?: string;
  onSelect: (variantId: string, storageGb: number, basePrice: number) => void;
}

interface Variant {
  id: string;
  storage_gb: number;
  base_price: number;
}

interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
}

const VariantSelection = ({ deviceId, deviceName, onSelect }: Props) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch device details
      const { data: deviceData, error: deviceError } = await supabase
        .from("devices")
        .select("*")
        .eq("id", deviceId)
        .single();

      if (deviceError) {
        console.error("Error fetching device:", deviceError);
      } else {
        setDevice(deviceData);
      }

      // Fetch variants
      const { data: variantsData, error: variantsError } = await supabase
        .from("variants")
        .select("*")
        .eq("device_id", deviceId)
        .order("storage_gb");

      if (variantsError) {
        console.error("Error fetching variants:", variantsError);
      } else {
        setVariants(variantsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [deviceId]);

  const handleSelect = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleGetExactValue = () => {
    if (selectedVariant) {
      onSelect(selectedVariant.id, selectedVariant.storage_gb, selectedVariant.base_price);
    }
  };

  const formatStorage = (gb: number) => {
    if (gb >= 1000) {
      const tb = gb / 1000;
      // If it's a whole number (like 1.0, 2.0), don't show decimals
      return tb % 1 === 0 ? `${tb}TB` : `${tb.toFixed(1)}TB`;
    }
    return `${gb}GB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Choose <span style={{ color: "#4169E1" }}>Variant</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Select storage capacity for your {device?.name || deviceName || "device"}
        </p>
      </div>

      <Card className="p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Storage Capacity</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {variants.slice(0, 3).map((variant, index) => (
            <motion.button
              key={variant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(variant)}
              className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedVariant?.id === variant.id
                  ? "bg-[#4169E1] text-white shadow-md scale-105"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {formatStorage(variant.storage_gb)}
            </motion.button>
          ))}
        </div>

        {variants.length > 3 && (
          <div className="grid grid-cols-2 gap-4">
            {variants.slice(3, 5).map((variant, index) => (
              <motion.button
                key={variant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index + 3) * 0.05 }}
                onClick={() => handleSelect(variant)}
                className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  selectedVariant?.id === variant.id
                    ? "bg-[#4169E1] text-white shadow-md scale-105"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {formatStorage(variant.storage_gb)}
              </motion.button>
            ))}
          </div>
        )}

        {variants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No variants available for this device</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedVariant && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-6 border-t"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#4169E1]" />
                    <span className="font-medium">Selected Variant</span>
                  </div>
                  <span className="text-lg font-semibold">
                    {formatStorage(selectedVariant.storage_gb)}
                  </span>
                </div>

                <div className="bg-[#4169E1]/10 rounded-lg p-6 border-2 border-[#4169E1]/20">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Estimated Price</p>
                    <div className="text-5xl font-bold text-[#4169E1]">
                      ₹{selectedVariant.base_price.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      *Base price for {formatStorage(selectedVariant.storage_gb)} variant
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleGetExactValue}
                  size="lg"
                  className="w-full bg-[#4169E1] hover:bg-[#3557C1] transition-colors text-lg py-6 shadow-xl"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Get Exact Value
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Answer quick questions to get your warranty-based pricing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          *Final price will be based on your device's warranty period
        </p>
      </div>
    </div>
  );
};

export default VariantSelection;