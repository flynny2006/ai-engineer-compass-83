import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Home, LayoutGrid, Package, Star, Users, Activity, AlertTriangle, FileText, Eye, Trash2, Copy, Edit3, ExternalLink, Code, Search, Filter, SlidersHorizontal, PlusCircle, Briefcase, CheckCircle } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ProjectFile {
  name: string;
  content: string;
  type: string;
}
interface Project {
  id: string;
  name: string;
  files: ProjectFile[];
  createdAt: string;
  lastModified: string;
  isFeatured?: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (e: React.MouseEvent, projectId: string) => void;
  onDuplicateProject: (e: React.MouseEvent, project: Project) => void;
  userPlan: string;
  apiKey: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  setProjects,
  onLoadProject,
  onDeleteProject,
  onDuplicateProject,
  userPlan,
  apiKey
}) => {
  const [activeMainTab, setActiveMainTab] = useState("projects");
  const [activeProjectsSubTab, setActiveProjectsSubTab] = useState("all");

  const handleToggleFeatured = (projectId: string) => {
    const projectToToggle = projects.find(p => p.id === projectId);
    if (!projectToToggle) return;

    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, isFeatured: !projectToToggle.isFeatured } : p
    );
    setProjects(updatedProjects);
    // localStorage update is handled in Homepage
  };

  const featuredProjects = projects.filter(p => p.isFeatured);
  const allProjects = projects;

  // Dummy data for overview, replace with actual data fetching or props
  const aiRequestsThisMonth = 1234;
  const totalStorageUsed = "2.5 GB";

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-20">
      <Tabs defaultValue="projects" value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20 dark:bg-black/50 border border-border/30 dark:border-white/10 p-1 rounded-lg modern-tabs mb-8">
          <TabsTrigger value="overview" className="modern-tab">
            <Home className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="modern-tab">
            <LayoutGrid className="h-4 w-4 mr-2" /> Projects
            {projects.length > 0 && <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary dark:bg-gray-600 dark:text-white">{projects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="packages" className="modern-tab">
            <Package className="h-4 w-4 mr-2" /> Templates <Badge variant="default" className="ml-2 bg-green-500 text-black dark:text-white">New</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 p-6 bg-card border border-border/40 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-background/50 dark:bg-secondary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{projects.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-background/50 dark:bg-secondary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{userPlan}</div>
                {userPlan === 'Free Tier' && <Button variant="link" size="sm" className="px-0 text-primary">Upgrade Plan</Button>}
              </CardContent>
            </Card>
            <Card className="bg-background/50 dark:bg-secondary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">API Key Status</CardTitle>
                {apiKey ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${apiKey ? 'text-green-500' : 'text-yellow-500'}`}>
                  {apiKey ? 'Set & Active' : 'Not Set'}
                </div>
                {!apiKey && <Button variant="link" size="sm" className="px-0 text-primary">Set API Key</Button>}
              </CardContent>
            </Card>
            <Card className="bg-background/50 dark:bg-secondary/30">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Requests (Soon)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{aiRequestsThisMonth.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
             <Card className="bg-background/50 dark:bg-secondary/30">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used (Soon)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalStorageUsed}</div>
                <p className="text-xs text-muted-foreground">of 10 GB</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-muted-foreground mt-6 text-sm">More detailed analytics and settings are coming soon.</p>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Tabs defaultValue="all" value={activeProjectsSubTab} onValueChange={setActiveProjectsSubTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <TabsList className="grid grid-cols-2 sm:w-max sm:grid-cols-2 gap-1 bg-muted/20 dark:bg-black/50 border border-border/30 dark:border-white/10 p-1 rounded-lg modern-tabs">
                <TabsTrigger value="all" className="modern-tab">
                    All Projects
                </TabsTrigger>
                <TabsTrigger value="featured" className="modern-tab flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" /> Featured
                </TabsTrigger>
                </TabsList>
                 <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Input type="search" placeholder="Search projects..." className="pl-10 modern-input w-full" />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="border-border/50">
                                    <SlidersHorizontal className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Filter options (soon)</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <TabsContent value="all">
              {allProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onLoadProject={onLoadProject}
                      onDeleteProject={(e) => onDeleteProject(e, project.id)}
                      onDuplicateProject={(e) => onDuplicateProject(e, project)}
                      onToggleFeatured={() => handleToggleFeatured(project.id)}
                      userPlan={userPlan}
                      projectCount={projects.length}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg bg-card">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-6">Start by creating a new project or exploring our templates.</p>
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
                      onLoadProject={onLoadProject}
                      onDeleteProject={(e) => onDeleteProject(e, project.id)}
                      onDuplicateProject={(e) => onDuplicateProject(e, project)}
                      onToggleFeatured={() => handleToggleFeatured(project.id)}
                      userPlan={userPlan}
                      projectCount={projects.length}
                    />
                  ))}
                </div>
              ) : (
                 <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg bg-card">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Featured Projects</h3>
                    <p className="text-muted-foreground mb-6">Star your important projects to quickly access them here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="packages" className="mt-6 p-6 bg-card border border-border/40 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Explore Project Templates</h2>
          <p className="text-muted-foreground mb-6">
            Kickstart your development with pre-built templates for various applications. More templates are coming soon!
          </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Portfolio Website</CardTitle>
                <CardDescription>A sleek, modern portfolio template.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Coming Soon</Badge>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>E-commerce Dashboard</CardTitle>
                <CardDescription>Admin panel for an online store.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Coming Soon</Badge>
              </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProjectsSection;
