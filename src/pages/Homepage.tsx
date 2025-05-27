import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Zap, LayoutDashboard, Code, HelpCircle, Star, PlusCircle, UploadCloud, Settings, LogOut, Eye, Edit3, Trash2, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { ModernPromptInput } from '@/components/ui/prompt-input'; // Assuming this is the correct path
import { BorderTrail } from '@/components/ui/border-trail'; // Assuming this is the correct path
import { HomepageNav } from '@/components/HomepageNav'; // Assuming this is the correct path
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FileExplorerUpload = lazy(() => import('@/components/FileExplorerUpload'));
const ProjectsSection = lazy(() => import('@/components/ProjectsSection')); // Assuming this is the correct path

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  files?: any[]; // Define a proper type if possible
}

const placeholderTexts = [
  "Develop a sleek To-Do list application...",
  "Create a modern weather dashboard with API integration...",
  "Build an interactive portfolio website for a photographer...",
  "Design a recipe sharing platform with user accounts...",
  "Generate a landing page for a new SaaS product...",
  "Craft a blog template with markdown support...",
  "Develop a simple e-commerce storefront for handmade goods...",
  "Create a personal finance tracker with charts...",
  "Build a real-time chat application interface...",
  "Design a booking system for a small hotel...",
  "Generate a set of UI components for a design system...",
  "Create a workout logger app with progress tracking...",
  "Build a note-taking app with rich text editing...",
  "Design an event management platform front-end...",
  "Generate a survey form builder UI...",
  "Craft a documentation site template...",
  "Develop a simple CRM interface for small businesses...",
  "Create a dashboard for IoT device monitoring...",
  "Build a UI for a music streaming service...",
  "Design a community forum interface..."
];

const AnimatedPlaceholder = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth logic

  useEffect(() => {
    // Load projects from localStorage on component mount
    const savedProjects = localStorage.getItem("saved_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleCreateNewProject = () => {
    // Generate a unique ID for the new project
    const projectId = Math.random().toString(36).substring(2, 15);
  
    // Create a new project object with a default name and description
    const newProject = {
      id: projectId,
      name: "New Project",
      description: "A new project created on " + new Date().toLocaleDateString(),
      lastModified: new Date().toISOString(),
    };
  
    // Update the projects state with the new project
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
  
    // Save the updated projects to localStorage
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
  
    // Navigate to the project editor with the new project's ID
    navigate(`/project?id=${projectId}`);
  };

  const handleSelectProject = (projectId: string) => {
    // Navigate to the project editor with the selected project's ID
    navigate(`/project?id=${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    // Filter out the project to be deleted
    const updatedProjects = projects.filter((project) => project.id !== projectId);
  
    // Update the projects state
    setProjects(updatedProjects);
  
    // Save the updated projects to localStorage
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
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the prompt in localStorage
      localStorage.setItem("current_prompt", prompt);

      // Generate a unique ID for the new project
      const projectId = Math.random().toString(36).substring(2, 15);

      // Create a new project object with a default name and description
      const newProject = {
        id: projectId,
        name: "New Project",
        description: prompt,
        lastModified: new Date().toISOString(),
      };

      // Update the projects state with the new project
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);

      // Save the updated projects to localStorage
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      localStorage.setItem("current_project_id", projectId);

      // Simulate a successful response
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/project?id=${projectId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate project.",
      });
      setIsLoading(false);
    }
  }, [prompt, navigate]);

  const handleFileUpload = (uploadedFile: { name: string; content: string; type: string }) => {
    // Generate a unique ID for the new project
    const projectId = Math.random().toString(36).substring(2, 15);
  
    // Create a new project object with the uploaded file
    const newProject = {
      id: projectId,
      name: "New Project",
      description: `Imported from ${uploadedFile.name}`,
      lastModified: new Date().toISOString(),
      files: [uploadedFile], // Store the uploaded file in the project
    };
  
    // Update the projects state with the new project
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
  
    // Save the updated projects to localStorage
    localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
    localStorage.setItem("current_project_id", projectId);
  
    // Navigate to the project editor with the new project's ID
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
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Read what our users have to say about their experience with our AI Web App Generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
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
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
              </div>
              <p className="text-muted-foreground mb-4">
                "The AI-powered code generation is incredibly accurate, and the real-time preview feature is a huge time-saver. Highly recommended!"
              </p>
              <p className="font-medium text-foreground">- John K.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const FAQSection = () => (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our AI Web App Generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              How accurate is the AI code generation?
            </h3>
            <p className="text-muted-foreground">
              Our AI algorithms are trained on a vast dataset of web development code, resulting in highly accurate code generation.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Can I customize the generated code?
            </h3>
            <p className="text-muted-foreground">
              Yes, our built-in code editor allows you to fine-tune the generated code to meet your specific needs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              What file types are supported for upload?
            </h3>
            <p className="text-muted-foreground">
              We support HTML, CSS, and JavaScript files for upload, allowing you to enhance the AI-generated code.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Is there any documentation available?
            </h3>
            <p className="text-muted-foreground">
              Yes, we provide comprehensive documentation and tutorials to guide you through every step of the process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const CTABanner = () => (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Unleash the power of AI to create stunning web applications in just a few simple steps.
        </p>
        <Button onClick={handleCreateNewProject} className="btn-primary text-lg px-8 py-3">
          Create Your First Project
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="py-6 md:py-8 border-t border-border">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} AI Web App Generator. All rights reserved.
      </div>
    </footer>
  );

  const FloatingActionButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/important')}
            variant="circle"
            size="icon"
            className="fixed bottom-4 right-4 z-50 shadow-lg hover-scale"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help?</p>
        </TooltipContent>
      </TooltipProvider>
    </TooltipProvider>
  );

  return (
    <TooltipProvider>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 text-neutral-800' : 'bg-gradient-to-br from-slate-900 via-black to-slate-950 text-neutral-200'}`}>
        <HomepageNav 
          isLoggedIn={isLoggedIn} 
          onLogin={() => setIsLoggedIn(true) /* Replace with actual login */} 
          onLogout={() => setIsLoggedIn(false) /* Replace with actual logout */}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          currentTheme={theme}
        />

        <main className="flex-grow">
          <AIPoweredSection />
          
          {isLoggedIn && (
            <section id="projects" className={`py-12 md:py-16 ${theme === 'light' ? 'bg-amber-50' : 'bg-slate-900'}`}>
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className={`text-3xl font-bold ${theme === 'light' ? 'text-neutral-800' : 'text-white'}`}>Your Projects</h2>
                  <Button onClick={handleCreateNewProject} variant="outline" className={`${theme === 'light' ? 'text-neutral-700 border-neutral-400 hover:bg-amber-100 hover:border-amber-500' : 'text-neutral-300 border-neutral-700 hover:bg-slate-700 hover:border-slate-500'}`}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Project
                  </Button>
                </div>
                <Suspense fallback={<div className={`p-8 rounded-lg text-center ${theme === 'light' ? 'bg-white text-neutral-600' : 'bg-slate-800 text-neutral-400'}`}>Loading projects...</div>}>
                  <ProjectsSection 
                    projects={projects} 
                    onSelectProject={handleSelectProject}
                    onDeleteProject={handleDeleteProject}
                    onCreateNewProject={handleCreateNewProject}
                  />
                </Suspense>
                {projects.length === 0 && !isLoading && (
                  <Card className={`${theme === 'light' ? 'bg-white shadow-amber-100' : 'bg-slate-800 shadow-slate-950/50'} mt-6 text-center glass-card`}>
                    <CardContent className="p-8">
                      <LayoutDashboard className={`mx-auto h-12 w-12 mb-4 ${theme === 'light' ? 'text-amber-500' : 'text-primary'}`} />
                      <h3 className={`text-xl font-semibold mb-2 ${theme === 'light' ? 'text-neutral-700' : 'text-white'}`}>No Projects Yet</h3>
                      <p className={`${theme === 'light' ? 'text-neutral-600' : 'text-muted-foreground'} mb-4`}>
                        Start by generating a new project or upload your existing files.
                      </p>
                      <Button onClick={handleCreateNewProject} className="btn-primary">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
          <CTABanner />
        </main>
        
        <Footer />
        <FloatingActionButton />
      </div>
    </TooltipProvider>
  );
};

export default Homepage;
