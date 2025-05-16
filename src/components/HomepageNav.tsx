
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Gift, Compass } from 'lucide-react'; // Added Compass for Boongle AI logo

const HomepageNav = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-md sticky top-0 z-50 w-full border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
          <Compass className="h-7 w-7 text-green-400" />
          <span className="font-semibold text-xl">Boongle AI</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/supabase" className="flex items-center">
              <Database className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Supabase</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
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
