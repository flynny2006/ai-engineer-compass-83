
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { User, KeyRound, UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserData) => void;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  plan: 'FREE' | 'PRO' | 'TEAMS' | 'BIG TEAMS';
  credits: {
    daily: number;
    monthly: number;
  };
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Login successful
        delete user.password; // Don't store password in state
        localStorage.setItem('currentUser', JSON.stringify(user));
        onSuccess(user);
        toast({
          title: "Success!",
          description: "You have successfully logged in."
        });
        onClose();
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: UserData & { password: string } = {
        id: `user_${Date.now()}`,
        username,
        email,
        password,
        plan: 'FREE',
        credits: {
          daily: 20,
          monthly: 500
        }
      };

      // Add to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Login user
      const { password: _, ...userData } = newUser; // Remove password from user data
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      toast({
        title: "Success!",
        description: "Your account has been created and you're now logged in."
      });
      
      onSuccess(userData);
      onClose();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {mode === 'login' ? 'Login to Your Account' : 'Create an Account'}
          </DialogTitle>
        </DialogHeader>
        
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setMode('register')}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Don't have an account? Register
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <Input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johnsmith" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="registerEmail" className="block text-sm font-medium">Email</label>
              <Input 
                id="registerEmail" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="registerPassword" className="block text-sm font-medium">Password</label>
              <Input 
                id="registerPassword" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setMode('login')}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Already have an account? Login
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
