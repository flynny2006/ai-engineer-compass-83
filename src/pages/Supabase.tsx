
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Lock, Server, Code, FileCode, Shield, Key, RefreshCcw, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">Connect to Supabase</h1>
            <p className="text-muted-foreground">
              Supabase is an open source Firebase alternative providing all the backend services
              you need to build a product. Authentication, database, storage, and more.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <div className="w-full max-w-[300px]">
              <AspectRatio ratio={3/2} className="bg-muted rounded-lg overflow-hidden">
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-emerald-500/30">
                  <svg width="120" height="120" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="#3ECF8E"/>
                    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                    <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04076L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                    <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3ECF8E" stopOpacity="0"/>
                    <stop offset="1" stopColor="#3ECF8E"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>PostgreSQL database</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Store and query your data with the power of PostgreSQL, enhanced with realtime capabilities.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>User management</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Complete user management with email/password, magic links, OAuth providers, and phone auth.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Storage</CardTitle>
                <CardDescription>File management</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Store, organize, and serve large files with object storage backed by S3.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Edge Functions</CardTitle>
                <CardDescription>Serverless functions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Write custom code that runs on the edge, close to your users for optimal performance.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>RLS Policies</CardTitle>
                <CardDescription>Row level security</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Control who can access your data with PostgreSQL's built-in row level security.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>API</CardTitle>
                <CardDescription>Auto-generated API</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Instantly available RESTful and GraphQL APIs for your database schema.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Connect</h2>
          
          <div className="space-y-4">
            <div className="bg-background p-4 rounded-md border flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <GitBranch className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Step 1: Create a Supabase Account</h3>
                <p className="text-muted-foreground">Sign up for a free Supabase account at supabase.com if you don't have one already.</p>
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-md border flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Step 2: Create a New Project</h3>
                <p className="text-muted-foreground">Create a new project in the Supabase dashboard and note your project URL and API keys.</p>
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-md border flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileCode className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Step 3: Configure Connection Settings</h3>
                <p className="text-muted-foreground">Enter your Supabase project URL and anon key in the configuration panel (coming soon).</p>
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-md border flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <RefreshCcw className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Step 4: Start Building</h3>
                <p className="text-muted-foreground">Once connected, you'll be able to use Supabase for authentication, database, and storage.</p>
              </div>
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
