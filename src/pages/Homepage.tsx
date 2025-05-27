import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Zap, LayoutDashboard, Code, HelpCircle, Star, PlusCircle, UploadCloud, Settings, LogOut, Eye, Edit3, Trash2, Sun, Moon, Search, FileText, FolderOpen, Database, Users, ShieldCheck, Palette, Settings2, BarChart2, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast'; // Corrected import path for shadcn toast
import { useTheme } from '@/hooks/use-theme';
import { ModernPromptInput } from '@/components/ui/prompt-input';
import { HomepageNav } from '@/components/HomepageNav';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FileExplorerUpload = lazy(() => import('@/components/FileExplorerUpload'));
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  files: any[]; // Made files required
  isFeatured?: boolean; // Added to align with ProjectsSection, optional here
}

// ... keep existing code (placeholderTexts and AnimatedPlaceholder component)
const placeholderTexts = [
  "A landing page for a SaaS product",
  "A blog about sustainable living",
  "An e-commerce site for handmade jewelry",
  "A portfolio for a freelance photographer",
  "A web app for tracking daily habits",
  "A simple todo list application",
  "A personal website with a blog",
  "A recipe website with user accounts",
  "A small business website with contact form",
  "A landing page for a mobile app",
];

const AnimatedPlaceholder: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [texts.length]);

  // This component returns a string, not JSX, if used directly as a prop value.
  // However, it was passed as <AnimatedPlaceholder ... /> which is JSX.
  return <>{texts[index]}</>; 
};


const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme(); // theme and setTheme are used by HomepageNav internally now
  const [prompt, setPrompt] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  // const [showProjects, setShowProjects] = useState(false); // This state seems unused
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // This state seems unused, auth should be handled properly

  // State for the animated placeholder text string
  const [currentPlaceholderText, setCurrentPlaceholderText] = useState(placeholderTexts[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderText(prev => {
        const currentIndex = placeholderTexts.indexOf(prev);
        return placeholderTexts[(currentIndex + 1) % placeholderTexts.length];
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const savedProjects = localStorage.getItem("saved_projects");
    if (savedProjects) {
      try {
        const parsedProjects: Project[] = JSON.parse(savedProjects);
        // Ensure all projects have a files array
        const normalizedProjects = parsedProjects.map(p => ({
          ...p,
          files: p.files || [],
          isFeatured: p.isFeatured || false,
        }));
        setProjects(normalizedProjects);
      } catch (error) {
        console.error("Failed to parse projects from localStorage:", error);
        setProjects([]); // Reset to empty array on error
      }
    }
  }, []);

  const handleCreateNewProject = () => {
    const projectId = Math.random().toString(36).substring(2, 15);
    const newProject: Project = {
      id: projectId,
      name: "New Project",
      description: "A new project created on " + new Date().toLocaleDateString(),
      lastModified: new Date().toISOString(),
      files: [], // Initialize files as empty array
      isFeatured: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    navigate(`/project?id=${projectId}`);
  };

  const handleSelectProject = (projectId: string) => { // Signature changed
    navigate(`/project?id=${projectId}`);
  };

  const handleDeleteProject = (event: React.MouseEvent, projectId: string) => {
    event.stopPropagation(); // Prevent card click
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({
      title: "Project deleted",
      description: "The project was successfully deleted.",
    });
  };
  
  // Callback to toggle 'isFeatured' status of a project
  const handleToggleFeaturedProject = (projectId: string) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({
        title: p => p.isFeatured ? "Project Pinned" : "Project Unpinned",
        description: `Project "${projects.find(p => p.id === projectId)?.name}" status updated.`,
    });
  };

  const handlePromptSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a description for your project.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem("current_prompt", prompt);
      const projectId = Math.random().toString(36).substring(2, 15);
      const newProject: Project = {
        id: projectId,
        name: prompt.substring(0,30) + (prompt.length > 30 ? "..." : ""), // Use part of prompt as name
        description: prompt,
        lastModified: new Date().toISOString(),
        files: [], // Initialize files as empty array
        isFeatured: false,
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      localStorage.setItem("current_project_id", projectId);

      setTimeout(() => {
        setIsLoading(false);
        navigate(`/project?id=${projectId}`);
      }, 1500); // Reduced timeout
    } catch (error: any) {
      console.error("Error submitting prompt:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [prompt, navigate, projects]); // Added projects to dependency array

  const handleFileUpload = (uploadedFile: { name: string; content: string; type: string }) => {
    const projectId = Math.random().toString(36).substring(2, 15);
    const newProject: Project = {
      id: projectId,
      name: uploadedFile.name, // Use file name as project name
      description: `Imported from ${uploadedFile.name}`,
      lastModified: new Date().toISOString(),
      files: [uploadedFile],
      isFeatured: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    localStorage.setItem("current_project_id", projectId);
    navigate(`/project?id=${projectId}`);
  };
  
  const AIPoweredSection = () => (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            Build at the <span className="text-gradient-primary">Speed of Thought</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Turn your ideas into reality faster than ever. Describe your vision, and let our AI craft the foundation for your next web application.
          </p>
        </div>

        <Card className="w-full max-w-3xl mx-auto shadow-xl dark:bg-secondary/50 glass-card">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <ModernPromptInput
                value={prompt}
                onValueChange={setPrompt} // Assuming ModernPromptInput has onValueChange
                onSubmit={handlePromptSubmit}
                // placeholder prop removed as it's not supported by ModernPromptInput based on TS error
                // The actual placeholder text for the input element within ModernPromptInput
                // should be managed by its `inputProps` or a direct `placeholder` prop if it exists and expects string.
                // For now, we use the animated text for the input's own placeholder attribute.
                inputProps={{ placeholder: currentPlaceholderText }}
                isLoading={isLoading}
                className="text-base md:text-lg"
              />
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button 
                  onClick={handlePromptSubmit} 
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto btn-primary text-base px-8 py-3"
                  size="lg"
                >
                  {isLoading ? (
                    <><Brain className="animate-pulse mr-2 h-5 w-5" />Building...</>
                  ) : (
                    <><Zap className="mr-2 h-5 w-5" />Generate Project</>
                  )}
                </Button>
                <Suspense fallback={<div className="w-full sm:w-auto h-12 bg-muted rounded-md animate-pulse"></div>}>
                  <FileExplorerUpload onFileUpload={handleFileUpload}>
                    <Button variant="outline" className="w-full sm:w-auto text-base px-6 py-3 border-dashed border-foreground/30 hover:border-primary hover:text-primary transition-colors duration-200">
                      <UploadCloud className="mr-2 h-5 w-5" />
                      Upload Files
                    </Button>
                  </FileExplorerUpload>
                </Suspense>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Start with a prompt or upload existing HTML/CSS/JS files to begin. <a href="/important" className="underline hover:text-primary">Learn more</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  // ... keep existing code (FeaturesSection, HowItWorksSection, TestimonialsSection components)
  const FeaturesSection = () => (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Key Features
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the powerful features that make our AI Web App Generator the perfect tool for your next project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-lift">
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">AI-Powered Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Describe your web app idea, and our AI will generate clean, efficient, and customizable code.
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <Eye className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">Real-Time Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Instantly preview your web app as the AI generates the code, allowing you to visualize your project in real-time.
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <Edit3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">Customizable Code Editor</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Fine-tune the generated code with our built-in code editor, making it easy to customize and optimize your web app.
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <UploadCloud className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">File Upload Support</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Upload your existing HTML, CSS, and JavaScript files to kickstart your project and enhance the AI-generated code.
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">Theme Customization</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Customize the look and feel of your web app with a variety of themes and styling options.
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <HelpCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-xl font-semibold">Helpful Documentation</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Access comprehensive documentation and tutorials to guide you through every step of the web app generation process.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const HowItWorksSection = () => (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Unleash the power of AI to create stunning web applications in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Describe Your Idea</h3>
            <p className="text-muted-foreground">
              Enter a detailed prompt describing the web application you want to create.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Code className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">AI Generates Code</h3>
            <p className="text-muted-foreground">
              Our AI algorithms will generate the code based on your prompt, creating a functional web app.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Eye className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Preview and Customize</h3>
            <p className="text-muted-foreground">
              Preview your web app in real-time and customize the code to meet your specific needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-foreground">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Read what our users have to say about their experience with our AI Web App Generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" />
              </div>
              <p className="text-muted-foreground mb-4">
                "I was amazed at how quickly and easily I could generate a fully functional web app with this tool. It's a game-changer!"
              </p>
              <p className="font-medium text-foreground">- Sarah M.</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-500 mr-1" /><Star className="h-5 w-5 text-yellow-400 mr-1" /> {/* One less star */}
              </div>
              <p className="text-muted-foreground mb-4">
                "The AI Web App Generator has significantly sped up my development workflow. Highly recommended!"
              </p>
              <p className="font-medium text-foreground">- John B.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const CTASection = () => (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-purple-600 dark:from-primary/80 dark:to-purple-700 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Build Your Next Project?
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of developers and creators who are building amazing web applications with our AI-powered platform.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-3"
          onClick={() => document.querySelector<HTMLElement>('section')?.scrollIntoView({ behavior: 'smooth' })} // Scrolls to top section (AIPoweredSection)
        >
          Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="py-8 border-t border-border/60 bg-muted/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AI Web App Generator. All rights reserved.</p>
        <p className="mt-1">
          <a href="/privacy" className="hover:text-primary">Privacy Policy</a> | <a href="/terms" className="hover:text-primary">Terms of Service</a>
        </p>
      </div>
    </footer>
  );

  const FloatingActionButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default" // Ensure variant is valid, default is usually safe
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50 flex items-center justify-center"
            onClick={handleCreateNewProject}
          >
            <PlusCircle className="h-7 w-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Create New Project</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HomepageNav /> {/* Removed props */}

      <main className="flex-grow">
        <AIPoweredSection />

        {projects.length > 0 && (
          <Suspense fallback={<div className="text-center py-10">Loading projects...</div>}>
            <ProjectsSection 
              projects={projects} 
              onLoadProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              // Pass handleToggleFeaturedProject to ProjectsSection if that component is meant to call it
              // onToggleFeatured={handleToggleFeaturedProject} 
            />
          </Suspense>
        )}

        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Homepage;
