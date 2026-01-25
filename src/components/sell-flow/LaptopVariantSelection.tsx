import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  deviceId: string;
  deviceName: string;
  onSelect: (
    variantId: string,
    processor: string,
    ramGb: number,
    storageGb: number,
    screenSize: string
  ) => void;
}

/** ✅ FIXED Variant Shape Based on Supabase Join Output */
interface Variant {
  id: string;
  storage_gb: number;
  screen_size: string;
  processors: { name: string } | null;
  ram_options: { size_gb: number } | null;
}

const LaptopVariantSelection = ({ deviceId, deviceName, onSelect }: Props) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProcessor, setSelectedProcessor] = useState<string | null>(null);
  const [selectedRam, setSelectedRam] = useState<number | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [processors, setProcessors] = useState<string[]>([]);
  const [ramOptions, setRamOptions] = useState<number[]>([]);
  const [storageOptions, setStorageOptions] = useState<number[]>([]);
  const [screenSizes, setScreenSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("variants")
        .select(`
          id,
          storage_gb,
          screen_size,
          processors:processor_id ( name ),
          ram_options:ram_id ( size_gb )
        `)
        .eq("device_id", deviceId);

      if (error) {
        console.error("Error fetching variants:", error);
      } else {
        /** ✅ FIX: TypeScript understands Supabase join result */
        setVariants(data as unknown as Variant[]);

        setProcessors([
          ...new Set(data?.map((v: any) => v.processors?.name).filter(Boolean)),
        ]);

        setRamOptions([
          ...new Set(data?.map((v: any) => v.ram_options?.size_gb).filter(Boolean)),
        ].sort((a, b) => a - b));

        setStorageOptions([
          ...new Set(data?.map((v: any) => v.storage_gb).filter(Boolean)),
        ].sort((a, b) => a - b));

        setScreenSizes([
          ...new Set(data?.map((v: any) => v.screen_size).filter(Boolean)),
        ]);
      }

      setLoading(false);
    };

    fetchVariants();
  }, [deviceId]);

  const getAvailableRamOptions = () => {
    if (!selectedProcessor) return ramOptions;

    return [
      ...new Set(
        variants
          .filter((v) => v.processors?.name === selectedProcessor)
          .map((v) => v.ram_options?.size_gb)
      ),
    ].sort((a, b) => a - b) as number[];
  };

  const getAvailableStorageOptions = () => {
    if (!selectedProcessor || !selectedRam) return storageOptions;

    return [
      ...new Set(
        variants
          .filter(
            (v) =>
              v.processors?.name === selectedProcessor &&
              v.ram_options?.size_gb === selectedRam
          )
          .map((v) => v.storage_gb)
      ),
    ].sort((a, b) => a - b) as number[];
  };

  const getAvailableScreenSizes = () => {
    if (!selectedProcessor || !selectedRam || !selectedStorage) return screenSizes;

    return [
      ...new Set(
        variants
          .filter(
            (v) =>
              v.processors?.name === selectedProcessor &&
              v.ram_options?.size_gb === selectedRam &&
              v.storage_gb === selectedStorage
          )
          .map((v) => v.screen_size)
      ),
    ];
  };

  useEffect(() => {
    if (selectedProcessor && selectedRam && selectedStorage && selectedScreenSize) {
      const variant = variants.find(
        (v) =>
          v.processors?.name === selectedProcessor &&
          v.ram_options?.size_gb === selectedRam &&
          v.storage_gb === selectedStorage &&
          v.screen_size === selectedScreenSize
      );

      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedProcessor, selectedRam, selectedStorage, selectedScreenSize, variants]);

  const handleContinue = () => {
    if (selectedVariant) {
      onSelect(
        selectedVariant.id,
        selectedProcessor!,
        selectedRam!,
        selectedStorage!,
        selectedScreenSize!
      );
    }
  };

  const formatStorage = (gb: number) =>
    gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up px-4 py-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
          System <span style={{ color: "#4169E1" }}>Configuration</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg">
          Choose your {deviceName}'s configuration
        </p>
      </div>

      <Card className="p-4 md:p-8 shadow-lg space-y-8">

        {/* Processor */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Processor</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {processors.map((processor, index) => (
              <motion.button
                key={processor}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedProcessor(processor);
                  setSelectedRam(null);
                  setSelectedStorage(null);
                  setSelectedScreenSize(null);
                }}
                className={`py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                  selectedProcessor === processor
                    ? "bg-[#4169E1] text-white shadow-md scale-105"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {processor}
              </motion.button>
            ))}
          </div>
        </div>

        {/* RAM */}
        {selectedProcessor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-4">RAM</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getAvailableRamOptions().map((ram, index) => (
                <motion.button
                  key={ram}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedRam(ram);
                    setSelectedStorage(null);
                    setSelectedScreenSize(null);
                  }}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    selectedRam === ram
                      ? "bg-[#4169E1] text-white shadow-md scale-105"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {ram} GB
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Storage */}
        {selectedProcessor && selectedRam && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-4">Storage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getAvailableStorageOptions().map((storage, index) => (
                <motion.button
                  key={storage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedStorage(storage);
                    setSelectedScreenSize(null);
                  }}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    selectedStorage === storage
                      ? "bg-[#4169E1] text-white shadow-md scale-105"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {formatStorage(storage)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Screen Size */}
        {selectedProcessor && selectedRam && selectedStorage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-4">Screen Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {getAvailableScreenSizes().map((size, index) => (
                <motion.button
                  key={size}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedScreenSize(size)}
                  className={`py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    selectedScreenSize === size
                      ? "bg-[#4169E1] text-white shadow-md scale-105"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue to Pricing */}
        <AnimatePresence mode="wait">
          {selectedVariant && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 border-t"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#4169E1]" />
                  <span className="font-semibold">Configuration Selected</span>
                </div>

                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="w-full bg-[#4169E1] hover:bg-[#3557C1] text-lg py-6 shadow-xl"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Continue to Pricing
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </Card>
    </div>
  );
};

export default LaptopVariantSelection;