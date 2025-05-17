
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Gift, Compass } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const HomepageNav = () => {
  const { theme } = useTheme();
  const [plan, setPlan] = useState<string>("FREE");
  
  useEffect(() => {
    // Check if any plan code is claimed from localStorage
    const claimedPlan = localStorage.getItem("claimed_plan");
    if (claimedPlan) {
      setPlan(claimedPlan);
    }
  }, []);
  
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
  
  return (
    <nav className="bg-black/50 backdrop-blur-md sticky top-0 z-50 w-full border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
          <Compass className="h-7 w-7 text-green-400" />
          <span className="font-semibold text-xl">Boongle AI</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`hidden sm:flex items-center mr-2 ${planDetails.color} text-xs font-medium px-2 py-1 rounded-full border border-white/10`}>
            {planDetails.name} - {typeof planDetails.maxProjects === 'number' ? `Maximum ${planDetails.maxProjects} Projects` : planDetails.maxProjects}
          </div>
          
          <Button variant={theme === 'light' ? 'modern' : 'ghost'} asChild>
            <Link to="/supabase" className="flex items-center">
              <Database className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline text-black dark:text-white">Supabase</span>
            </Link>
          </Button>
          <Button variant={theme === 'light' ? 'modern' : 'ghost'} asChild>
            <Link to="/pricing" className="flex items-center">
              <Gift className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline text-black dark:text-white">Pricing</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default HomepageNav;
