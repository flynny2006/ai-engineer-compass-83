
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
import NavigationControls from "./components/NavigationControls";
import { useEffect } from "react";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  // Add CSS classes to chat and preview containers for toggling
  useEffect(() => {
    // Add the classes after the component mounts
    const addContainerClasses = () => {
      // Find the chat container element
      const chatContainer = document.querySelector('#gpt-engineer-chat');
      if (chatContainer) {
        chatContainer.classList.add('chat-container');
      }
      
      // Find the preview container element
      const previewContainer = document.querySelector('#gpt-engineer-preview');
      if (previewContainer) {
        previewContainer.classList.add('preview-container');
      }
    };
    
    // Add initially and also set up a mutation observer to detect when elements are added
    addContainerClasses();
    
    // Set up a mutation observer to watch for changes to the body element
    const observer = new MutationObserver((mutations) => {
      addContainerClasses();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
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
};

export default App;
