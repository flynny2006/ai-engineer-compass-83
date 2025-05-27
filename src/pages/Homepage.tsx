import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Zap, LayoutDashboard, Code, HelpCircle, Star, PlusCircle, UploadCloud, Settings, LogOut, Eye, Edit3, Trash2, Sun, Moon, Search, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast'; // This should be from '@/components/ui/use-toast' if using shadcn's toast
import { useTheme } from '@/hooks/use-theme';
import { PromptInput } from '@/components/ui/prompt-input'; // Changed from ModernPromptInput
import { BorderTrail } from '@/components/ui/border-trail';
import HomepageNav from '@/components/HomepageNav'; // Changed to default import
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FileExplorerUpload = lazy(() => import('@/components/FileExplorerUpload'));
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  createdAt: string; // Added createdAt
  files?: any[]; 
}

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
    }, 2000);

    return () => clearInterval(intervalId);
  }, [texts.length]);

  return <>{texts[index]}</>;
};

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming user is logged in for project display

  useEffect(() => {
    const savedProjects = localStorage.getItem("saved_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleCreateNewProject = () => {
    const projectId = Math.random().toString(36).substring(2, 15);
    const newProject: Project = { // Added Project type
      id: projectId,
      name: "New Project",
      description: "A new project created on " + new Date().toLocaleDateString(),
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(), // Added createdAt
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    navigate(`/project?id=${projectId}`);
  };

  const handleSelectProject = (_event: React.MouseEvent<Element, MouseEvent>, projectId: string) => { // Adjusted signature
    navigate(`/project?id=${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    toast({
      title: "Project deleted",
      description: "The project was successfully deleted."
    });
  };

  const handlePromptSubmit = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem("current_prompt", prompt);
      const projectId = Math.random().toString(36).substring(2, 15);
      const newProject: Project = { // Added Project type
        id: projectId,
        name: "New Project from Prompt",
        description: prompt,
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(), // Added createdAt
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      localStorage.setItem("current_project_id", projectId);

      setTimeout(() => {
        setIsLoading(false);
        navigate(`/project?id=${projectId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate project.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [prompt, navigate, projects]); // Added projects to dependency array

  const handleFileUpload = (uploadedFile: { name: string; content: string; type: string }) => {
    const projectId = Math.random().toString(36).substring(2, 15);
    const newProject: Project = { // Added Project type
      id: projectId,
      name: `Project from ${uploadedFile.name}`,
      description: `Imported from ${uploadedFile.name}`,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(), // Added createdAt
      files: [{ name: uploadedFile.name, content: uploadedFile.content, type: uploadedFile.type }],
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
              <PromptInput // Changed from ModernPromptInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onSubmit={handlePromptSubmit}
                placeholder={<AnimatedPlaceholder texts={placeholderTexts} />}
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
                    <>
                      <Brain className="animate-pulse mr-2 h-5 w-5" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Generate Project
                    </>
                  )}
                </Button>
                <Suspense fallback={<div className="w-full sm:w-auto h-12 bg-muted rounded-md animate-pulse"></div>}>
                  {/* Assuming FileExplorerUpload is a button-like component itself or has a default trigger */}
                  <FileExplorerUpload 
                    onFileUpload={handleFileUpload} 
                    variant="outline" 
                    className="w-full sm:w-auto text-base px-6 py-3 border-dashed border-foreground/30 hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    <UploadCloud className="mr-2 h-5 w-5" />
                    Upload Files
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

  const FeaturesSection = () => (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-foreground">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the powerful features that make our AI Web App Generator stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Intuitive Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Our user-friendly interface makes it easy to describe your project and generate code.
            </CardContent>
          </Card>

          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Code className="h-5 w-5 text-primary" />
                AI-Powered Code Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Leverage the power of AI to generate clean, efficient, and customizable code for your web apps.
            </CardContent>
          </Card>

          <Card className="modern-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <HelpCircle className="h-5 w-5 text-primary" />
                Help and Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Access comprehensive documentation and helpful resources to guide you through the process.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const HowItWorksSection = () => (
    <section className="py-12 md:py-16 bg-muted/50 dark:bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn how to quickly generate web applications using our AI-powered tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Describe Your Idea</h3>
            <p className="text-muted-foreground">Enter a detailed prompt describing your desired web application.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Generate Code</h3>
            <p className="text-muted-foreground">Our AI will generate the necessary code based on your prompt.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Preview and Customize</h3>
            <p className="text-muted-foreground">Preview the generated app, customize the code, and deploy your project.</p>
          </div>
        </div>
      </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-foreground">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Read what our users are saying about their experience with the AI Web App Generator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="modern-card hover-lift">
            <CardContent>
              <div className="mb-4">
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
              </div>
              <p className="text-muted-foreground">
                "The AI Web App Generator has revolutionized my workflow. I can now create web apps in a fraction of the time!"
              </p>
              <p className="mt-2 font-medium text-foreground">- John Doe, Web Developer</p>
            </CardContent>
          </Card>

          <Card className="modern-card hover-lift">
            <CardContent>
              <div className="mb-4">
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                <Star className="h-5 w-5 text-gray-400 inline-block mr-1" />
              </div>
              <p className="text-muted-foreground">
                "As a non-technical founder, I was able to quickly prototype my ideas and get my project off the ground thanks to this tool."
              </p>
              <p className="mt-2 font-medium text-foreground">- Jane Smith, Entrepreneur</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const FloatingActionButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/important')}
            variant="default" 
            size="icon"
            className="fixed bottom-4 right-4 z-50 shadow-lg hover-scale rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HomepageNav 
        theme={theme} 
        setTheme={setTheme} 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setIsLoggedIn(true)} 
        onLogout={() => {
          setIsLoggedIn(false);
          // Potentially clear user session data here
        }}
        onViewProjects={() => setShowProjects(!showProjects)}
        onCreateNewProject={handleCreateNewProject}
      />

      <main className="flex-grow">
        <AIPoweredSection />

        {isLoggedIn && (
          <Suspense fallback={<div className="container mx-auto px-4 py-8"><p>Loading projects...</p></div>}>
            <ProjectsSection
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onCreateNewProject={handleCreateNewProject}
            />
          </Suspense>
        )}

        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>

      <footer className="py-8 border-t border-border/40 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lovable AI Web App Generator. All rights reserved.</p>
          <div className="mt-2">
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <span className="mx-2">|</span>
            <a href="/important" className="hover:text-primary transition-colors">Terms of Service</a>
            <span className="mx-2">|</span>
            <a href="/important" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
      <FloatingActionButton />
    </div>
  );
};

export default Homepage;
