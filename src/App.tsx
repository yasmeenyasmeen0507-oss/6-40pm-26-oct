import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SellMobiles from "./pages/SellMobiles";
import SellLaptop from "./pages/SellLaptop";
import SellIpad from "./pages/SellIpad";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPickupRequests from "./pages/admin/PickupRequests";
import AdminLeads from "./pages/admin/Leads";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminPricing from "./pages/admin/Pricing";
import AdminLayout from "./layouts/AdminLayout";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            {/* Routes WITHOUT MainLayout */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Redirect /sell to homepage */}
            <Route path="/sell" element={<Navigate to="/" replace />} />
            
            {/* Category-specific routes */}
            <Route path="/sell/mobiles" element={<SellMobiles />} />
            <Route path="/sell/laptop" element={<SellLaptop />} />
            <Route path="/sell/ipad" element={<SellIpad />} />
            
            <Route path="*" element={<NotFound />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="pickup-requests" element={<AdminPickupRequests />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="devices" element={<div>Devices</div>} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="pricing" element={<AdminPricing />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;