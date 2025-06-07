
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, LayoutGrid, Package, Star, Users, Activity, ArrowUpDown } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
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
  const [sortBy, setSortBy] = useState("recent");

  const handleToggleFeatured = (projectId: string) => {
    const updatedProjects = projects.map(p => p.id === projectId ? {
      ...p,
      isFeatured: !p.isFeatured
    } : p);
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
  };

  const sortProjects = (projectsToSort: Project[]) => {
    const sorted = [...projectsToSort];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
      case "creation":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  };

  const featuredProjects = sortProjects(projects.filter(p => p.isFeatured));
  const allProjects = sortProjects(projects);

  // Dummy data for overview, replace with actual data fetching or props
  const aiRequestsThisMonth = 1234;
  const totalStorageUsed = "2.5 GB";

  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <Tabs defaultValue="projects" value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white transition-all">
            <Home className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white transition-all">
            <LayoutGrid className="h-4 w-4 mr-2" /> Projects 
            {projects.length > 0 && <Badge variant="secondary" className="ml-2 bg-gray-600 text-white">{projects.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white transition-all">
            <Package className="h-4 w-4 mr-2" /> Packages <Badge variant="default" className="ml-2 bg-green-500 text-black">New</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-md">
              <h3 className="text-gray-400 text-sm">Total Projects</h3>
              <p className="text-white text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-md">
              <h3 className="text-gray-400 text-sm">Plan</h3>
              <p className="text-white text-2xl font-bold">{userPlan}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-md">
              <h3 className="text-gray-400 text-sm">API Key Status</h3>
              <p className={`text-2xl font-bold ${apiKey ? 'text-green-400' : 'text-yellow-400'}`}>
                {apiKey ? 'Set' : 'Not Set'}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-md">
              <Activity className="h-5 w-5 text-blue-400 mb-2" />
              <h3 className="text-gray-400 text-sm">AI Requests (Soon)</h3>
              <p className="text-white text-xl font-semibold">{aiRequestsThisMonth.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-md">
              <Users className="h-5 w-5 text-purple-400 mb-2" />
              <h3 className="text-gray-400 text-sm">Total Storage Used (Avaible Soon)</h3>
              <p className="text-white text-xl font-semibold">{totalStorageUsed}</p>
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-xs">More detailed analytics coming soon.</p>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Tabs defaultValue="all" value={activeProjectsSubTab} onValueChange={setActiveProjectsSubTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="grid w-full grid-cols-2 sm:w-max sm:grid-cols-2 gap-2 bg-white/5 border border-white/10 p-1 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white transition-all">
                  All Projects
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white transition-all flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" /> Featured
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="creation">Creation Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all">
              {allProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onLoadProject={onLoadProject} 
                      onDeleteProject={onDeleteProject} 
                      onDuplicateProject={onDuplicateProject} 
                      onToggleFeatured={handleToggleFeatured} 
                      userPlan={userPlan} 
                      projectCount={projects.length} 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">You have no projects yet. Start building something amazing!</p>
              )}
            </TabsContent>
            
            <TabsContent value="featured">
              {featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onLoadProject={onLoadProject} 
                      onDeleteProject={onDeleteProject} 
                      onDuplicateProject={onDuplicateProject} 
                      onToggleFeatured={handleToggleFeatured} 
                      userPlan={userPlan} 
                      projectCount={projects.length} 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">You have no featured projects yet. Star some projects to see them here!</p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="packages" className="mt-6 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Explore Packages</h2>
          <p className="text-gray-400">
            Discover and integrate pre-built packages and templates to accelerate your development. This section is coming soon!
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsSection;
