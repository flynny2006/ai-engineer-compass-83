
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const NavigationControls: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showControls, setShowControls] = useState(false);
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  
  // Only show controls on project page
  useEffect(() => {
    setShowControls(location.pathname === "/project");
    
    // Find the preview iframe on the project page
    if (location.pathname === "/project") {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      setIframeElement(iframe);
    }
  }, [location.pathname]);
  
  // Toggle preview visibility
  const togglePreview = () => {
    const previewContainer = document.querySelector('.preview-container') as HTMLElement;
    const chatContainer = document.querySelector('.chat-container') as HTMLElement;
    
    if (previewContainer && chatContainer) {
      if (previewVisible) {
        // Hide preview
        previewContainer.style.display = 'none';
        chatContainer.style.width = '100%';
        toast({
          title: "Preview hidden",
          description: "Chat now has full width"
        });
      } else {
        // Show preview
        previewContainer.style.display = 'block';
        chatContainer.style.width = '';
        toast({
          title: "Preview visible",
          description: "Chat and preview are now displayed side by side"
        });
      }
      setPreviewVisible(!previewVisible);
    }
  };
  
  if (!showControls) return null;
  
  // Function to reload the preview
  const handleReload = () => {
    if (iframeElement && iframeElement.contentWindow) {
      iframeElement.contentWindow.location.reload();
      toast({
        title: "Preview reloaded",
        description: "The preview has been refreshed"
      });
    } else {
      // If we can't directly access the iframe, try to find it again
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.location.reload();
        toast({
          title: "Preview reloaded",
          description: "The preview has been refreshed"
        });
      }
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={togglePreview} 
              variant="circle" 
              size="icon" 
              className="shadow-lg"
            >
              {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{previewVisible ? "Hide preview" : "Show preview"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
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
