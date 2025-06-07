
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Important from "./pages/Important";
import Supabase from "./pages/Supabase";
import Homepage from "./pages/Homepage";
import ProjectEditor from "./pages/ProjectEditor";
import OurTeam from "./pages/OurTeam";
import NavigationControls from "./components/NavigationControls";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationControls />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/project" element={<ProjectEditor />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/important" element={<Important />} />
            <Route path="/supabase" element={<Supabase />} />
            <Route path="/our-team" element={<OurTeam />} />
            {/* Redirect old index route to new one */}
            <Route path="/index" element={<Navigate to="/project" replace />} />
            {/* Dynamic routes for pages that might be created by the AI */}
            <Route path="/:pageName" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
