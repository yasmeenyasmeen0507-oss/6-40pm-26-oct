import { motion } from "framer-motion";
import { Smartphone, Laptop, Tablet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DeviceCategory } from "@/pages/Index";

interface Props {
  onSelect: (category: DeviceCategory) => void;
}

const categories = [
  {
    id: "phone" as DeviceCategory,
    title: "Sell Phone",
    icon: Smartphone,
    gradient: "from-primary to-primary-glow",
  },
  {
    id: "laptop" as DeviceCategory,
    title: "Sell Laptop",
    icon: Laptop,
    gradient: "from-secondary to-secondary/80",
  },
  {
    id: "ipad" as DeviceCategory,
    title: "Sell iPad",
    icon: Tablet,
    gradient: "from-accent to-accent/80",
  },
];

const CategorySelection = ({ onSelect }: Props) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Sell Your Device for the Best Price
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant valuation and hassle-free pickup. Choose your device category to begin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-primary/50 overflow-hidden"
                onClick={() => onSelect(category.id)}
              >
                <CardContent className="p-8 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${category.gradient} mb-6 relative group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 relative">{category.title}</h3>
                  <p className="text-muted-foreground relative">Get the best value instantly</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="text-3xl font-bold text-primary mb-2">24/7</div>
          <div className="text-muted-foreground">Instant Pickup</div>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-3xl font-bold text-secondary mb-2">100%</div>
          <div className="text-muted-foreground">Secure Transaction</div>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="text-3xl font-bold text-accent mb-2">2 Min</div>
          <div className="text-muted-foreground">Quick Valuation</div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
