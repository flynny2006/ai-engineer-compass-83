
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Supabase = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Connect to Supabase</h1>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Connect</h2>
          
          <div className="space-y-4">
            <div className="bg-background p-4 rounded-md border">
              <h3 className="font-medium text-lg mb-2">Step 1: Create a Supabase Account</h3>
              <p className="text-muted-foreground">Sign up for a free Supabase account at supabase.com if you don't have one already.</p>
            </div>
            
            <div className="bg-background p-4 rounded-md border">
              <h3 className="font-medium text-lg mb-2">Step 2: Create a New Project</h3>
              <p className="text-muted-foreground">Create a new project in the Supabase dashboard and note your project URL and API keys.</p>
            </div>
            
            <div className="bg-background p-4 rounded-md border">
              <h3 className="font-medium text-lg mb-2">Step 3: Configure Connection Settings</h3>
              <p className="text-muted-foreground">Enter your Supabase project URL and anon key in the configuration panel (coming soon).</p>
            </div>
            
            <div className="bg-background p-4 rounded-md border">
              <h3 className="font-medium text-lg mb-2">Step 4: Start Building</h3>
              <p className="text-muted-foreground">Once connected, you'll be able to use Supabase for authentication, database, and storage.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
          <p className="text-amber-800 dark:text-amber-300">
            Supabase integration is coming soon. Please check back later for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Supabase;
