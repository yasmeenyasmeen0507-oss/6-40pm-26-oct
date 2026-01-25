import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SellMobiles from "./pages/SellMobiles";
import SellLaptop from "./pages/SellLaptop";
import SellIpad from "./pages/SellIpad";
import DevicePage from "./pages/DevicePage";
import CityPage from "./pages/CityPage";
import CityLandingPage from "./pages/CityLandingPage";
import CitiesHub from "./pages/CitiesHub";
import VariantPage from "./pages/VariantPage";
import ConditionPage from "./pages/ConditionPage";
import VerifyPage from "./pages/VerifyPage";
import ValuationPage from "./pages/ValuationPage";
import PickupPage from "./pages/PickupPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Pricing from "./pages/Pricing";
import HowItWorks from "./pages/HowItWorks";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPickupRequests from "./pages/admin/PickupRequests";
import AdminLeads from "./pages/admin/Leads";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminPricing from "./pages/admin/Pricing";
import AdminPickupAgents from "./pages/admin/PickupAgents";
import AdminWarrantyPrices from "./pages/admin/WarrantyPrices";
import AdminVariants from "./pages/admin/Variants";
import PickupPartnerLogin from "./pages/pickup-partner/Login";
import PickupPartnerDashboard from "./pages/pickup-partner/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { PickupPartnerAuthProvider } from "./contexts/PickupPartnerAuthContext";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { ProtectedPickupPartnerRoute } from "./components/pickup-partner/ProtectedPickupPartnerRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AdminAuthProvider>
            <PickupPartnerAuthProvider>
              <Routes>
                {/* Routes WITHOUT MainLayout */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Redirect /sell to homepage */}
                <Route path="/sell" element={<Navigate to="/" replace />} />

                {/* ========== CITIES HUB PAGE ========== */}
                <Route path="/cities" element={<CitiesHub />} />

                {/* ========== SEO CITY LANDING PAGES ========== */}
                <Route path="/sell-phone-in-bangalore" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-delhi" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-mumbai" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-chennai" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-hyderabad" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-pune" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-jaipur" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-kolkata" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-lucknow" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-kanpur" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-varanasi" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-agra" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-thane" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-chandigarh" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-amritsar" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-ludhiana" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-patna" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-gorakhpur" element={<CityLandingPage />} />
                <Route path="/sell-phone-in-mathura" element={<CityLandingPage />} />

                {/* ========== MOBILES FLOW ========== */}
                <Route path="/sell/mobiles" element={<SellMobiles />} />
                <Route path="/sell/mobiles/:brandSlug" element={<DevicePage category="phone" />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug" element={<CityPage category="phone" />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug" element={<VariantPage category="phone" />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug/:variantSlug" element={<ConditionPage category="phone" />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification" element={<VerifyPage />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success" element={<ValuationPage />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup" element={<PickupPage />} />
                <Route path="/sell/mobiles/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup/success" element={<PickupPage />} />

                {/* ========== LAPTOP FLOW ========== */}
                <Route path="/sell/laptop" element={<SellLaptop />} />
                <Route path="/sell/laptop/:brandSlug" element={<SellLaptop />} />
                <Route path="/sell/laptop/:brandSlug/:citySlug/verify" element={<SellLaptop />} />
                <Route path="/sell/laptop/:brandSlug/:citySlug/success" element={<SellLaptop />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug" element={<CityPage category="laptop" />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug" element={<VariantPage category="laptop" />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug/:variantSlug" element={<ConditionPage category="laptop" />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification" element={<VerifyPage />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success" element={<ValuationPage />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup" element={<PickupPage />} />
                <Route path="/sell/laptop/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup/success" element={<PickupPage />} />

                {/* ========== IPAD FLOW ========== */}
                <Route path="/sell/ipad" element={<SellIpad />} />
                <Route path="/sell/ipad/:brandSlug" element={<DevicePage category="ipad" />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug" element={<CityPage category="ipad" />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug" element={<VariantPage category="ipad" />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug/:variantSlug" element={<ConditionPage category="ipad" />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification" element={<VerifyPage />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success" element={<ValuationPage />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup" element={<PickupPage />} />
                <Route path="/sell/ipad/:brandSlug/:deviceSlug/:citySlug/:variantSlug/verification/success/pickup/success" element={<PickupPage />} />

                {/* Info pages */}
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<AboutUs />} />

                {/* Pickup Partner Routes */}
                <Route path="/pickup-partner/login" element={<PickupPartnerLogin />} />
                <Route
                  path="/pickup-partner/dashboard"
                  element={
                    <ProtectedPickupPartnerRoute>
                      <PickupPartnerDashboard />
                    </ProtectedPickupPartnerRoute>
                  }
                />

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
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="pickup-requests" element={<AdminPickupRequests />} />
                  <Route path="pickup-agents" element={<AdminPickupAgents />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="devices" element={<div>Devices</div>} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="pricing" element={<AdminPricing />} />
                  <Route path="warranty-prices" element={<AdminWarrantyPrices />} />
                  <Route path="variants" element={<AdminVariants />} />
                </Route>
              </Routes>
            </PickupPartnerAuthProvider>
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
