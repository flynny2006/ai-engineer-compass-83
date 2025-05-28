
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, FileText, Gift, Coins } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mock credits data - you can replace this with actual data from your app state
  const userCredits = 250;
  const maxCredits = 800;
  const creditsPercentage = (userCredits / maxCredits) * 100;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isMobile ? "icon" : "sm"} className={isMobile ? "h-9 w-9 p-0" : ""}>
          <FileText className="h-4 w-4" />
          {!isMobile && <span className="ml-1">Menu</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Credits Section */}
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Credits</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{userCredits} / {maxCredits}</span>
            </div>
            <Progress value={creditsPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {maxCredits - userCredits} credits remaining
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/" className="flex items-center cursor-pointer">
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex items-center cursor-pointer">
            <Gift className="h-4 w-4 mr-2" /> Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/important" className="flex items-center cursor-pointer">
            Important
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/supabase" className="flex items-center cursor-pointer">
            <Database className="h-4 w-4 mr-2" /> Supabase
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navigation;
