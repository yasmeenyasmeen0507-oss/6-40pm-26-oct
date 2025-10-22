import { useEffect } from "react";
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
  useEffect(() => {
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
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    }, 250);

    return () => clearInterval(interval);
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
          className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary to-secondary"
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
          <Card className="border-4 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-12">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-glow">
                ₹{finalPrice.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <TrendingUp className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-semibold">Best Value</h3>
              <p className="text-sm text-muted-foreground">Competitive market price</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Shield className="w-8 h-8 text-secondary mx-auto" />
              <h3 className="font-semibold">100% Safe</h3>
              <p className="text-sm text-muted-foreground">Secure transaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Clock className="w-8 h-8 text-accent mx-auto" />
              <h3 className="font-semibold">Quick Pickup</h3>
              <p className="text-sm text-muted-foreground">At your convenience</p>
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
            className="bg-gradient-to-r from-primary via-secondary to-accent text-white px-12 py-6 text-lg animate-pulse-glow"
          >
            Sell Now & Schedule Pickup
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FinalValuation;
