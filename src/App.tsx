import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage";
import BrandPage from "./pages/BrandPage";
import DevicePage from "./pages/DevicePage";
import CityPage from "./pages/CityPage";
import VariantPage from "./pages/VariantPage";
import ConditionPage from "./pages/ConditionPage";
import VerifyPage from "./pages/VerifyPage";
import ValuationPage from "./pages/ValuationPage";
import PickupPage from "./pages/PickupPage";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<CategoryPage />} />
            <Route path="brand" element={<BrandPage />} />
            <Route path="device" element={<DevicePage />} />
            <Route path="city" element={<CityPage />} />
            <Route path="variant" element={<VariantPage />} />
            <Route path="condition" element={<ConditionPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="valuation" element={<ValuationPage />} />
            <Route path="pickup" element={<PickupPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
