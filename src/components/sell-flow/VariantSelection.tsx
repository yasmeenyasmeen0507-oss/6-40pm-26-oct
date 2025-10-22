// @ts-nocheck - Temporary: Supabase types are regenerating after migration
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, HardDrive, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  deviceId: string;
  onSelect: (variantId: string, storageGb: number, basePrice: number) => void;
}

interface Variant {
  id: string;
  storage_gb: number;
  base_price: number;
}

const VariantSelection = ({ deviceId, onSelect }: Props) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const fetchVariants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("variants")
        .select("*")
        .eq("device_id", deviceId)
        .order("storage_gb");

      if (error) {
        console.error("Error fetching variants:", error);
      } else {
        setVariants(data || []);
      }
      setLoading(false);
    };

    fetchVariants();
  }, [deviceId]);

  const handleSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    onSelect(variant.id, variant.storage_gb, variant.base_price);
  };

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
        <h2 className="text-3xl font-bold mb-4">Select Storage Variant</h2>
        <p className="text-muted-foreground">Choose your device's storage capacity</p>
      </div>

      <AnimatePresence mode="wait">
        {selectedVariant && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/30"
          >
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {selectedVariant.storage_gb}GB Selected
                </p>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Base Price: ₹{selectedVariant.base_price.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-6">
        {variants.map((variant, index) => (
          <motion.div
            key={variant.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 overflow-hidden group ${
                selectedVariant?.id === variant.id
                  ? "border-primary shadow-lg"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelect(variant)}
            >
              <div className={`h-2 ${
                selectedVariant?.id === variant.id
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : "bg-gradient-to-r from-gray-300 to-gray-400"
              }`} />
              <CardContent className="p-8 text-center relative">
                {selectedVariant?.id === variant.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className={`inline-flex p-4 rounded-full mb-4 transition-all ${
                  selectedVariant?.id === variant.id
                    ? "bg-primary/20 scale-110"
                    : "bg-primary/10 group-hover:scale-110"
                }`}>
                  <HardDrive className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{variant.storage_gb}GB</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVariant?.id === variant.id 
                    ? "Selected"
                    : "Click to select"
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {variants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No variants available for this device</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          *Final price will be calculated based on device condition and accessories
        </p>
      </div>
    </div>
  );
};

export default VariantSelection;