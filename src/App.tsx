import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPickupRequests from "./pages/admin/PickupRequests";
import AdminBrands from "./pages/admin/Brands";
import AdminCities from "./pages/admin/Cities";
import AdminReviews from "./pages/admin/Reviews";
import AdminActivityLogs from "./pages/admin/ActivityLogs";
import AdminSettings from "./pages/admin/Settings";
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
            <Route path="/" element={<Home />} />
            <Route path="/sell" element={<Index />} />

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
              <Route path="devices" element={<div>Devices</div>} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="cities" element={<AdminCities />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
