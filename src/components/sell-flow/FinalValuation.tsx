import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Shield, Clock } from "lucide-react";

interface Props {
  finalPrice: number;
  deviceName: string;
  onContinue: () => void;
}

const FinalValuation = ({ finalPrice, deviceName, onContinue }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Mark that user is on valuation page
    sessionStorage.setItem("on_valuation_page", "true");
    sessionStorage.setItem("valuation_timestamp", Date.now().toString());

    // ✅ Detect back button press
    const handlePopState = (event: PopStateEvent) => {
      console.log("🔙 Back button pressed on valuation page");
      
      // Clear valuation flag
      sessionStorage.removeItem("on_valuation_page");
      sessionStorage.removeItem("valuation_timestamp");
      
      // Navigate to home
      navigate("/", { replace: true });
    };

    // ✅ Detect page refresh (user is staying)
    const handleBeforeUnload = () => {
      sessionStorage.setItem("valuation_refreshed", "true");
    };

    // Add listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ["#4169E1", "#3557C1", "#5B7FE8"],
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#4169E1", "#3557C1", "#5B7FE8"],
      });
    }, 250);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  // ✅ Check if this is a page refresh (restore state)
  useEffect(() => {
    const wasRefreshed = sessionStorage.getItem("valuation_refreshed") === "true";
    const wasOnValuation = sessionStorage.getItem("on_valuation_page") === "true";

    if (wasRefreshed && wasOnValuation) {
      console.log("🔄 Valuation page refreshed - staying on page");
      sessionStorage.removeItem("valuation_refreshed");
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex p-6 rounded-full bg-[#4169E1]"
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Congratulations! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            Your {deviceName} is valued at
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <Card className="border-4 border-[#4169E1]/30 shadow-2xl bg-gradient-to-br from-[#4169E1]/5 to-[#4169E1]/10">
            <CardContent className="p-12">
              <div className="text-6xl md:text-7xl font-bold text-[#4169E1] animate-pulse-glow">
                ₹{finalPrice.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#4169E1]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Best Value</h3>
                    <p className="text-xs text-muted-foreground">Competitive price</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#4169E1]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">100% Safe</h3>
                    <p className="text-xs text-muted-foreground">Secure transaction</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#4169E1]" />
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Quick Pickup</h3>
                    <p className="text-xs text-muted-foreground">Your convenience</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-[#4169E1] hover:bg-[#3557C1] text-white px-12 py-6 text-lg animate-pulse-glow"
          >
            Sell Now & Schedule Pickup
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FinalValuation;