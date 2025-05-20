
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, User, LogOut } from 'lucide-react';
import { UserData } from '@/components/AuthModal';

interface AuthButtonsProps {
  isLoggedIn: boolean;
  user: UserData | null;
  onLogin: () => void;
  onLogout: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isLoggedIn, user, onLogin, onLogout }) => {
  return (
    <div className="flex gap-2 items-center">
      {isLoggedIn ? (
        <>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-xs text-gray-400">{user?.plan}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </>
      ) : (
        <Button variant="outline" size="sm" onClick={onLogin}>
          <LogIn className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
