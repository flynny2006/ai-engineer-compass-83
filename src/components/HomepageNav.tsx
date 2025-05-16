
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Gift, Sparkles } from 'lucide-react'; // Added Sparkles for logo

const HomepageNav = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-lg p-4 sticky top-0 z-50 border-b border-white/10">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Boongle AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/supabase">
              <Database className="h-4 w-4 mr-2" />
              Supabase
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/pricing">
              <Gift className="h-4 w-4 mr-2" />
              Pricing
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default HomepageNav;
