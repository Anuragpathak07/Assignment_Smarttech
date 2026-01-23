import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { useEffect } from "react";
import { api } from "./services/api";
import { toast } from "sonner";

import { PatientProvider } from "@/context/PatientContext";

const App = () => {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await api.healthCheck();
        console.log("Backend connected:", data);
        toast.success(data.message || "Backend connected successfully!");
      } catch (error) {
        console.error("Backend connection failed", error);
        toast.error("Failed to connect to backend");
      }
    };
    checkBackend();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PatientProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PatientProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
