import "./global.css";
import "./lib/apiFetch";
import React, { useEffect, useState } from "react";
import { Menu, Instagram, Facebook, Youtube, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useSettings } from "./hooks/useSettings";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

// Page Imports
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Clients from "./pages/Clients";
import AdminOrders from "./pages/AdminOrders";
import AdminGallery from "./pages/AdminGallery";
import AdminFilms from "./pages/AdminFilms";
import AdminUsers from "./pages/AdminUsers";
import AdminSlider from "./pages/AdminSlider";
import AdminLoveStories from "./pages/AdminLoveStories";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminContacts from "./pages/AdminContacts";
import AdminClients from "./pages/AdminClients";
import AdminInvoices from "./pages/AdminInvoices";
import AdminQuotations from "./pages/AdminQuotations";
import AccessoriesManagement from "./pages/AccessoriesManagement";
import AdminRegister from "./pages/AdminRegister";
import UserProfile from "./pages/UserProfile";
import AdminCommonTypes from "./pages/AdminCommonTypes";
import AdminSettings from "./pages/AdminSettings";
import AdminTeam from "./pages/AdminTeam";


const queryClient = new QueryClient();

// Auto Logout Hook
const useAutoLogout = (logoutCallback) => {
  useEffect(() => {
    let timer;
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Auto logging out due to inactivity");
        logoutCallback();
      }, INACTIVITY_LIMIT);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // If tab/screen is hidden, we might want to be more aggressive
        // But for now, let's keep the timer running. 
        // Or if the user explicitely meant "Screen Off" = "Phone locked" -> visibilityState becomes 'hidden'.
        // Let's logout immediately if they want strict security, or maybe after 1 min?
        // User said "automatically log out", implying immediacy or near-immediacy.
        // I will set a separate shorter timer for hidden state.
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("Auto logging out due to screen off/hidden");
          logoutCallback();
        }, 60 * 1000); // 1 minute allowed in background
      } else {
        resetTimer();
      }
    };

    // Events to detect activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resetTimer(); // Start timer

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => document.removeEventListener(event, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [logoutCallback]);
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Redirect /admin to / */}
          <Route path="/admin" element={<Navigate to="/" replace />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppShell = () => {
  const { data: settings } = useSettings();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  useAutoLogout(handleLogout);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Dynamic Title & Favicon Update
  useEffect(() => {
    if (settings) {
      if (settings.businessName) {
        document.title = settings.businessName + " | Admin Console";
      }
      if (settings.primaryLogo) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = settings.primaryLogo;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }, [settings]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation isMobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onLogout={handleLogout} />
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-charcoal-900"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
          <span className="text-sm font-semibold text-charcoal-900">{settings?.businessName || "Studio Console"}</span>
        </div>
        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/admin-common-types" element={<AdminCommonTypes />} />

            <Route path="/admin-quotations" element={<Quotations />} />

            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route path="/admin-gallery" element={<AdminGallery />} />
            <Route path="/admin-films" element={<AdminFilms />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-slider" element={<AdminSlider />} />
            <Route path="/admin-love-stories" element={<AdminLoveStories />} />
            <Route path="/admin-testimonials" element={<AdminTestimonials />} />
            <Route path="/admin-enquiries" element={<AdminEnquiries />} />
            <Route path="/admin-contact-messages" element={<AdminContacts />} />
            <Route path="/admin-clients" element={<AdminClients />} />
            <Route path="/admin-invoices" element={<AdminInvoices />} />

            <Route path="/admin-accessories" element={<AccessoriesManagement />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/admin-profile" element={<UserProfile />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/admin-team" element={<AdminTeam />} />


            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-6 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="font-medium text-sm text-charcoal-600">{settings?.businessName || "Studio"}</div>
              <span className="text-xs text-slate-500">© {new Date().getFullYear()}</span>
            </div>

            <div className="flex gap-4">
              {settings?.socialLinks?.filter(l => l.active).map((link, i) => {
                const Icon = {
                  'Instagram': Instagram,
                  'Facebook': Facebook,
                  'YouTube': Youtube,
                  'Twitter': Twitter,
                  'LinkedIn': Linkedin,
                }[link.platform] || LinkIcon;

                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-gold-600 transition-colors">
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);

export default App;
