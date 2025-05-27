import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, LayoutGrid, Package, Star, Users, Activity } from 'lucide-react';
import ProjectCard from './ProjectCard'; // Assuming ProjectCard is correctly implemented

interface Project {
  id: string;
  name: string;
  files: any[]; // Made files required to align with ProjectCard expectations
  lastModified: string;
  description?: string;
  isFeatured?: boolean; // This is specific to ProjectsSection's view logic
}

interface ProjectsSectionProps {
  projects: Project[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (event: React.MouseEvent<Element, MouseEvent>, projectId: string) => void;
  // Add onToggleFeatured to props if this functionality is to be lifted up
  // onToggleFeatured: (projectId: string) => void; 
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onLoadProject,
  onDeleteProject,
  // onToggleFeatured, // Use this if passed from parent
}) => {
  const [activeMainTab, setActiveMainTab] = useState("projects");
  const [activeProjectsSubTab, setActiveProjectsSubTab] = useState("all");

  const handleToggleFeatured = (projectId: string) => {
    // This function should ideally call a prop like `onToggleFeatured(projectId)`
    // For now, it only logs, as direct state mutation of props is an anti-pattern.
    // If you have a parent component (like Homepage.tsx) managing the `projects` state,
    // it should provide a function to handle this update.
    console.warn("Toggling featured status. Implement via parent component callback for persistence.", projectId);
    // Example: if (onToggleFeatured) onToggleFeatured(projectId);
  };

  const featuredProjects = projects.filter(p => p.isFeatured);
  const allProjects = projects;

  // Dummy data for overview, replace with actual data fetching or props
  const aiRequestsThisMonth = 1234;
  const totalStorageUsed = "2.5 GB";
  const userPlan = "FREE"; // Placeholder
  const apiKey = ""; // Placeholder

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="projects" value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-muted/30 dark:bg-black/50 border border-border dark:border-white/10 p-1 rounded-lg mb-6 modern-tabs">
          <TabsTrigger value="overview" className="modern-tab">
            <Home className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="modern-tab">
            <LayoutGrid className="h-4 w-4 mr-2" /> Projects
            {projects.length > 0 && <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary dark:bg-gray-600 dark:text-white">{projects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="packages" className="modern-tab">
            <Package className="h-4 w-4 mr-2" /> Packages <Badge variant="default" className="ml-2 bg-green-500 text-black px-1.5 py-0.5 text-xs">New</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 p-6 bg-card border border-border rounded-lg modern-card">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 dark:bg-secondary/50 rounded-md border border-border/50">
              <h3 className="text-muted-foreground text-sm mb-1">Total Projects</h3>
              <p className="text-foreground text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="p-4 bg-muted/50 dark:bg-secondary/50 rounded-md border border-border/50">
              <h3 className="text-muted-foreground text-sm mb-1">Current Plan</h3>
              <p className="text-foreground text-2xl font-bold">{userPlan}</p>
            </div>
            <div className="p-4 bg-muted/50 dark:bg-secondary/50 rounded-md border border-border/50">
              <h3 className="text-muted-foreground text-sm mb-1">API Key</h3>
              <p className={`text-2xl font-bold ${apiKey ? 'text-green-500' : 'text-yellow-500'}`}>
                {apiKey ? 'Active' : 'Not Set'}
              </p>
            </div>
            <div className="p-4 bg-muted/50 dark:bg-secondary/50 rounded-md border border-border/50 col-span-1 md:col-span-2 lg:col-span-1">
              <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400 mb-1" />
              <h3 className="text-muted-foreground text-sm">AI Requests (Current Cycle)</h3>
              <p className="text-foreground text-xl font-semibold">{aiRequestsThisMonth.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-muted/50 dark:bg-secondary/50 rounded-md border border-border/50 col-span-1 md:col-span-2 lg:col-span-1">
              <Users className="h-5 w-5 text-purple-500 dark:text-purple-400 mb-1" />
              <h3 className="text-muted-foreground text-sm">Storage Used</h3>
              <p className="text-foreground text-xl font-semibold">{totalStorageUsed}</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6 text-xs">More detailed analytics and account management options are coming soon.</p>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Tabs defaultValue="all" value={activeProjectsSubTab} onValueChange={setActiveProjectsSubTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2 gap-2 bg-muted/30 dark:bg-black/50 border border-border dark:border-white/10 p-1 rounded-lg mb-6 modern-tabs">
              <TabsTrigger value="all" className="modern-tab">
                All Projects
              </TabsTrigger>
              <TabsTrigger value="featured" className="modern-tab flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-400" /> Featured
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {allProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onLoadProject={() => onLoadProject(project.id)}
                      onDeleteProject={(e) => onDeleteProject(e, project.id)}
                      onToggleFeatured={() => handleToggleFeatured(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LayoutGrid className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating a new project or generating one with AI.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="featured">
              {featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onLoadProject={() => onLoadProject(project.id)}
                      onDeleteProject={(e) => onDeleteProject(e, project.id)}
                      onToggleFeatured={() => handleToggleFeatured(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Featured Projects</h3>
                  <p className="text-muted-foreground">Star your important projects to see them here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="packages" className="mt-6 p-6 bg-card border border-border rounded-lg modern-card">
          <div className="flex items-center mb-6">
            <Package className="h-8 w-8 mr-3 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Explore Packages</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Discover and integrate pre-built packages, templates, and UI kits to accelerate your development.
            This section is under construction and will be available soon!
          </p>
          <Button variant="outline" disabled>Browse Marketplace (Coming Soon)</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProjectsSection;
