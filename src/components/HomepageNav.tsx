
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Gift, Compass, Users } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const HomepageNav = () => {
  const { theme } = useTheme();
  const [plan, setPlan] = useState<string>("FREE");
  const [selectedModel, setSelectedModel] = useState<string>("Gemini 1.5 Flash");
  
  useEffect(() => {
    // Check if any plan code is claimed from localStorage
    const claimedPlan = localStorage.getItem("claimed_plan");
    if (claimedPlan) {
      setPlan(claimedPlan);
    }
    
    // Load saved model preference if available
    const savedModel = localStorage.getItem("selected_model");
    if (savedModel) {
      switch(savedModel) {
        case "gemini-1.5":
          setSelectedModel("Gemini 1.5 Flash");
          break;
        case "gemini-2.0":
          setSelectedModel("Gemini 2.0 Flash");
          break;
        case "gemini-2.0-pro":
          setSelectedModel("Gemini 2.0 Pro");
          break;
        default:
          setSelectedModel("Gemini 1.5 Flash");
      }
    }
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // Convert display name to storage ID
    let modelId = "gemini-1.5";
    switch(model) {
      case "Gemini 1.5 Flash":
        modelId = "gemini-1.5";
        break;
      case "Gemini 2.0 Flash":
        modelId = "gemini-2.0";
        break;
      case "Gemini 2.0 Pro":
        modelId = "gemini-2.0-pro";
        break;
    }
    
    // Check if Pro model is selected but user is on free plan
    if (modelId === "gemini-2.0-pro" && plan === "FREE") {
      alert("This model requires a paid plan. Please upgrade to access Gemini 2.0 Pro.");
      // Reset selection to default
      setSelectedModel("Gemini 1.5 Flash");
      modelId = "gemini-1.5";
    }
    
    localStorage.setItem("selected_model", modelId);
  };
  
  // Determine plan details
  const getPlanDetails = () => {
    switch(plan) {
      case "PRO":
        return { name: "PRO", maxProjects: 12, color: "text-blue-500" };
      case "TEAMS":
        return { name: "TEAMS", maxProjects: 20, color: "text-purple-500" };
      case "BIG TEAMS":
        return { name: "BIG TEAMS", maxProjects: "Unlimited", color: "text-green-500" };
      default:
        return { name: "FREE", maxProjects: 5, color: "text-gray-400" };
    }
  };
  
  const planDetails = getPlanDetails();
  const isPaidUser = plan !== "FREE";
  
  return (
    <nav className="bg-black/50 backdrop-blur-md sticky top-0 z-50 w-full border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
          <Compass className="h-7 w-7 text-green-400" />
          <span className="font-semibold text-xl">Boongle AI</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-black/50 border border-white/20 text-white text-xs">
                {selectedModel} <span className="ml-1 w-2 h-2 rounded-full bg-green-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleModelChange("Gemini 1.5 Flash")} className="cursor-pointer flex items-center justify-between">
                Gemini 1.5 Flash {selectedModel === "Gemini 1.5 Flash" && <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleModelChange("Gemini 2.0 Flash")} className="cursor-pointer flex items-center justify-between">
                Gemini 2.0 Flash {selectedModel === "Gemini 2.0 Flash" && <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleModelChange("Gemini 2.0 Pro")} 
                className={`cursor-pointer flex items-center justify-between ${!isPaidUser ? 'opacity-50' : ''}`}
                disabled={!isPaidUser}
              >
                Gemini 2.0 Pro {isPaidUser ? (
                  selectedModel === "Gemini 2.0 Pro" && <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                ) : (
                  <span className="ml-2 text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">PRO</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className={`hidden sm:flex items-center mr-2 ${planDetails.color} text-xs font-medium px-2 py-1 rounded-full border border-white/10`}>
            {planDetails.name} - {typeof planDetails.maxProjects === 'number' ? `Maximum ${planDetails.maxProjects} Projects` : planDetails.maxProjects}
          </div>
          
          <Button variant={theme === 'light' ? 'modern' : 'ghost'} asChild className="text-black dark:text-white">
            <Link to="/our-team" className="flex items-center">
              <Users className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Our Team</span>
            </Link>
          </Button>
          <Button variant={theme === 'light' ? 'modern' : 'ghost'} asChild className="text-black dark:text-white">
            <Link to="/supabase" className="flex items-center">
              <Database className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Supabase</span>
            </Link>
          </Button>
          <Button variant={theme === 'light' ? 'modern' : 'ghost'} asChild className="text-black dark:text-white">
            <Link to="/pricing" className="flex items-center">
              <Gift className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Pricing</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default HomepageNav;
