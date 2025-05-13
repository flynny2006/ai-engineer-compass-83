
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, FileText, Gift } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isMobile ? "icon" : "sm"} className={isMobile ? "h-9 w-9 p-0" : ""}>
          <FileText className="h-4 w-4" />
          {!isMobile && <span className="ml-1">Menu</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
