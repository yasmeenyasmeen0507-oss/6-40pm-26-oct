import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.pathname !== "/" && location.pathname !== "/valuation" && location.pathname !== "/pickup";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SellkarIndia
            </span>
          </div>
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
