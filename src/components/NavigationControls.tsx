
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NavigationControls: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showControls, setShowControls] = useState(false);
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(null);
  
  // Only show controls on project page
  useEffect(() => {
    setShowControls(location.pathname === "/project");
    
    // Find the preview iframe on the project page
    if (location.pathname === "/project") {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      setIframeElement(iframe);
    }
  }, [location.pathname]);
  
  if (!showControls) return null;
  
  // Function to reload the preview
  const handleReload = () => {
    if (iframeElement && iframeElement.contentWindow) {
      iframeElement.contentWindow.location.reload();
    } else {
      // If we can't directly access the iframe, try to find it again
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.location.reload();
      }
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleReload} 
              variant="circle" 
              size="icon" 
              className="shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reload preview</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => navigate('/')} 
              variant="circle" 
              size="icon" 
              className="shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Back to homepage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NavigationControls;
