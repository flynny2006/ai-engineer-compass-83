import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, UploadCloud, LogIn, UserPlus, Info, Sun, Moon, Settings, LayoutGrid, Package, FileText, Trash2, Star, Copy, AlertTriangle, Search, Filter, CheckCircle, XCircle, ChevronDown, ExternalLink, BookOpen, Briefcase, Users2, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ModernPromptInput from '@/components/ModernPromptInput';
import HomepageNav from '@/components/HomepageNav';
import ProjectsSection from '@/components/ProjectsSection';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FileExplorerUpload from '@/components/FileExplorerUpload';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const Homepage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [userPlan, setUserPlan] = useState('Free Tier'); // Example, replace with actual logic
  const [apiKey, setApiKey] = useState(''); // Example, replace with actual logic
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const newProjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem("saved_projects");
    const loadedProjects = savedProjects
      ? JSON.parse(savedProjects).map((p: any) => ({
          id: p.id || uuidv4(),
          name: p.name || "Untitled Project",
          files: Array.isArray(p.files) ? p.files : [], // Ensure files is an array
          createdAt: p.createdAt || new Date(0).toISOString(), // Add default if missing for older projects
          lastModified: p.lastModified || new Date().toISOString(),
          isFeatured: p.isFeatured || false,
        }))
      : [];
    setProjects(loadedProjects);

    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    // TODO: Fetch user plan status
  }, []);

  const handleCreateNewProject = (projectName?: string) => {
    const name = projectName || newProjectName.trim() || "Untitled Project";
    const newProjectId = uuidv4();
    const newProject: Project = {
      id: newProjectId,
      name: name,
      files: [
        { name: "index.html", content: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>" + name + "</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Hello, " + name + "!</h1>\n  <script src=\"script.js\"></script>\n</body>\n</html>", type: "html" },
        { name: "style.css", content: "body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background-color: #f0f0f0;\n}\nh1 {\n  color: #333;\n}", type: "css" },
        { name: "script.js", content: "console.log('Welcome to " + name + "');", type: "javascript" }
      ],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isFeatured: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    localStorage.setItem("current_project_id", newProjectId);
    setNewProjectName('');
    setIsNameModalOpen(false);
    navigate(`/project?id=${newProjectId}`);
    toast({ title: "Project Created", description: `Successfully created "${name}".` });
  };

  const handleFileUpload = (uploadedFile: { name: string; content: string; type: string }) => {
    const newProjectId = uuidv4();
    const newProject: Project = {
      id: newProjectId,
      name: uploadedFile.name.split('.')[0] || "Uploaded Project",
      files: [uploadedFile],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isFeatured: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    localStorage.setItem("current_project_id", newProjectId);
    navigate(`/project?id=${newProjectId}`);
    toast({ title: "Project Uploaded", description: `Successfully uploaded and created project from "${uploadedFile.name}".` });
  };

  const onLoadProject = (projectId: string) => {
    localStorage.setItem("current_project_id", projectId);
    // Update lastModified for the loaded project
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, lastModified: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    navigate(`/project?id=${projectId}`);
  };

  const onDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const projectToDelete = projects.find(p => p.id === projectId);
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({ title: "Project Deleted", description: `"${projectToDelete?.name}" has been deleted.`, variant: "destructive" });
    if (localStorage.getItem("current_project_id") === projectId) {
      localStorage.removeItem("current_project_id");
    }
  };

  const handleDuplicateProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const newProjectId = uuidv4();
    const newProject: Project = {
      ...project,
      id: newProjectId,
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(), // Set new createdAt
      lastModified: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({ title: "Project Duplicated", description: `"${project.name}" has been duplicated.` });
  };
  
  const handleToggleFeatured = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const updatedProjects = projects.map(p =>
      p.id === project.id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({
      title: project.isFeatured ? "Project Unpinned" : "Project Pinned",
      description: `"${project.name}" is no longer featured.`
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'featured' && project.isFeatured);
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 dark:from-slate-900 dark:to-purple-900/30 text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <HomepageNav />

      <header className="text-center my-12 sm:my-16 lg:my-20 fade-in">
        <Zap className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-glow" />
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-gradient-primary">Lovable</span>: Build with AI
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your AI-powered partner for crafting stunning web applications. Describe your vision, and watch it come to life in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="btn-primary shadow-lg hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300 group">
                <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card">
              <DialogHeader>
                <DialogTitle>Name Your New Project</DialogTitle>
                <DialogDescription>
                  Give your project a memorable name to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="projectName"
                  ref={newProjectInputRef}
                  placeholder="e.g., My Awesome App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="modern-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewProject()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNameModalOpen(false)}>Cancel</Button>
                <Button onClick={() => handleCreateNewProject()} className="btn-primary">Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <FileExplorerUpload onFileUpload={handleFileUpload}>
             {/* Content for FileExplorerUpload trigger, if any, is handled internally by the component based on its props. Cannot pass children here */}
          </FileExplorerUpload>
        </div>
      </header>
      
      <main className="w-full max-w-7xl mx-auto">
        <ProjectsSection
          projects={filteredProjects}
          setProjects={setProjects}
          onLoadProject={onLoadProject}
          onDeleteProject={onDeleteProject}
          onDuplicateProject={handleDuplicateProject}
          userPlan={userPlan}
          apiKey={apiKey}
        />

        <section id="features" className="py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why Choose <span className="text-gradient-primary">Lovable</span>?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Unlock features designed for speed, creativity, and ease of use.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI-Powered Development", description: "Generate code, components, and full pages with simple chat commands." },
              { icon: LayoutGrid, title: "Real-time Preview", description: "See your changes instantly, making iteration fast and intuitive." },
              { icon: Package, title: "Shadcn UI & Tailwind", description: "Build beautiful, responsive UIs with modern, best-in-class tools." },
              { icon: BookOpen, title: "Learn As You Build", description: "Understand the code with explanations from Lovable as it works." },
              { icon: Users2, title: "Community & Support", description: "Join our Discord, access docs, and get help when you need it." },
              { icon: Briefcase, title: "Focus on Your Vision", description: "Let Lovable handle the boilerplate, so you can focus on the unique aspects of your project." }
            ].map((feature, index) => (
              <Card key={index} className="modern-card hover-lift fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-4">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16 sm:my-20 lg:my-24" />

        <section id="testimonials" className="py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by Developers</h2>
             <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Hear what others are saying about their experience with Lovable.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Alice DevOps", role: "Full-Stack Developer", quote: "Lovable has revolutionized my workflow. I can prototype and build UIs faster than ever before!" },
              { name: "Bob Frontend", role: "UI/UX Designer", quote: "The real-time preview is a game-changer. It's amazing to see my ideas turn into code instantly." }
            ].map((testimonial, index) => (
              <Card key={index} className="modern-card fade-in" style={{animationDelay: `${index * 150}ms`}}>
                <CardContent className="pt-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full max-w-7xl mx-auto text-center py-12 mt-16 border-t border-border/50">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Lovable.ai. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/important" className="text-sm hover:text-primary transition-colors">Important Info</Link>
          <a href="https://discord.gg/hrq9cjXr27" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">Discord</a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
