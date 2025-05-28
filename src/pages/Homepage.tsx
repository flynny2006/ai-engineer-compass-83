import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Key, ArrowRight, Trash2, Copy, Building, Rocket, Code, Users, Compass, Zap, Timer, Eye, ChevronUp, Sparkles, Palette, ArrowUp, Star, LayoutDashboard, FolderKanban, PackageSearch } from "lucide-react";
import { BorderTrail } from "@/components/ui/border-trail";
import FileExplorerUpload from "@/components/FileExplorerUpload";
import HomepageNav from "@/components/HomepageNav";
import ModernPromptInput from "@/components/ModernPromptInput";
import GenerationStatus, { StatusItem } from "@/components/GenerationStatus";
import ProjectsSection from "@/components/ProjectsSection";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
  lastModified: string;
  isFeatured?: boolean; 
}

interface Partner {
  id: number;
  name: string;
  description: string;
  logoUrl?: string; 
}

// 32 predefined suggestions
const suggestions = [
  "Modern & functional Todo App",
  "AI-powered chat application",
  "E-commerce product showcase",
  "Personal portfolio website",
  "Real-time weather dashboard",
  "Music streaming interface",
  "Recipe sharing platform",
  "Fitness tracking dashboard",
  "Social media feed clone",
  "Project management tool",
  "Online booking system",
  "Interactive quiz game",
  "Video streaming platform",
  "Cryptocurrency tracker",
  "Task automation dashboard",
  "Event planning application",
  "File sharing platform",
  "Team collaboration workspace",
  "Learning management system",
  "Restaurant ordering app",
  "Travel planning tool",
  "Invoice generator app",
  "Photo gallery with filters",
  "News aggregator dashboard",
  "Customer support chat",
  "Expense tracking app",
  "Blog with CMS features",
  "Real estate listing site",
  "Job board platform",
  "Inventory management system",
  "Survey creation tool",
  "Digital art marketplace"
];

const Homepage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<StatusItem[]>([]);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-1.5");
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Scroll to top function with smooth animation
  const topRef = useRef<HTMLDivElement>(null);
  
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate 4 random suggestions on component mount
  useEffect(() => {
    const getRandomSuggestions = () => {
      const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    };
    setRandomSuggestions(getRandomSuggestions());
  }, []);

  // Sample partners data
  const partners = [
    { id: 1, name: "Acme Tech", description: "Leading AI infrastructure provider", logoUrl: "placeholder.svg" },
    { id: 2, name: "DataFlow Inc.", description: "Enterprise data solutions", logoUrl: "placeholder.svg" },
    { id: 3, name: "CloudNine", description: "Serverless architecture experts", logoUrl: "placeholder.svg" },
  ];

  // Load projects, API key, and plan from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const parsedProjects: Project[] = JSON.parse(savedProjects);
        // Ensure isFeatured is boolean or undefined
        const validatedProjects = parsedProjects.map(p => ({
          ...p,
          isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : false,
        }));
        setProjects(validatedProjects);
      }
      
      const savedApiKey = localStorage.getItem("api_key");
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      
      // Get user plan from localStorage
      const claimedPlan = localStorage.getItem("claimed_plan");
      if (claimedPlan) {
        setUserPlan(claimedPlan);
      }
      
      // Get saved model preference
      const savedModel = localStorage.getItem("selected_model");
      if (savedModel) {
        setSelectedModel(savedModel);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // If parsing fails, it might be due to old format, try to clear or handle gracefully
      localStorage.removeItem("saved_projects"); 
      setProjects([]);
    }
  }, []);

  const simulateGeneration = () => {
    // Clear any existing status
    setGenerationStatus([]);
    setShowStatus(true);
    
    // Simulate the generation process with real-time updates
    const steps: StatusItem[] = [
      { id: '1', text: 'Analyzing prompt...', status: 'loading', timestamp: Date.now() },
      { id: '2', text: 'Creating project structure', status: 'loading', timestamp: Date.now() + 100 },
      { id: '3', text: 'Generating index.html', status: 'pending', timestamp: Date.now() + 200 },
      { id: '4', text: 'Generating styles.css', status: 'pending', timestamp: Date.now() + 300 },
      { id: '5', text: 'Generating app.js', status: 'pending', timestamp: Date.now() + 400 },
      { id: '6', text: 'Building React components', status: 'pending', timestamp: Date.now() + 500 },
    ];
    
    // Add initial step
    setGenerationStatus([steps[0]]);
    
    // Update steps with simulated timing
    setTimeout(() => {
      setGenerationStatus([
        { ...steps[0], status: 'complete' },
        { ...steps[1] }
      ]);
      
      setTimeout(() => {
        setGenerationStatus(prev => [
          ...prev,
          { ...steps[2], status: 'loading' }
        ]);
        
        setTimeout(() => {
          setGenerationStatus(prev => prev.map(item => 
            item.id === '2' ? { ...item, status: 'complete' as const } : item
          ));
          
          setTimeout(() => {
            setGenerationStatus(prev => prev.map(item => 
              item.id === '3' ? { ...item, status: 'complete' as const } : item
            ).concat({ ...steps[3], status: 'loading' as const }));
            
            setTimeout(() => {
              setGenerationStatus(prev => prev.map(item => 
                item.id === '4' ? { ...item, status: 'complete' as const } : item
              ).concat({ ...steps[4], status: 'loading' as const }));
              
              setTimeout(() => {
                setGenerationStatus(prev => prev.map(item => 
                  item.id === '5' ? { ...item, status: 'complete' as const } : item
                ).concat({ ...steps[5], status: 'loading' as const }));
                
                setTimeout(() => {
                  setGenerationStatus(prev => prev.map(item => 
                    item.id === '6' ? { ...item, status: 'complete' as const } : item
                  ));
                  
                  // Hide status and navigate after completion
                  setTimeout(() => {
                    setShowStatus(false);
                    // Continue with actual navigation
                  }, 1000);
                }, 800);
              }, 700);
            }, 600);
          }, 500);
        }, 400);
      }, 600);
    }, 500);
  };

  const createNewProject = () => {
    if (projects.length >= 5 && userPlan === "FREE") {
      toast({
        title: "Project Limit Reached",
        description: "You have reached the maximum of 5 projects for the free plan. Please upgrade for more projects.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter what you want to build.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Generate a unique ID
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new project
    const newProject: Project = {
      id: projectId,
      name: prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      files: [], // Will be populated in the project editor
      isFeatured: false, // Default for new projects
    };

    // Add to existing projects
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // Save to localStorage
    try {
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      
      // Store current prompt as "last_prompt" for the project page
      localStorage.setItem("last_prompt", prompt);
      localStorage.setItem("selected_model", selectedModel);
      
      // Set the current project ID BEFORE navigation
      // This is important for project-specific storage
      localStorage.setItem("current_project_id", projectId);
      
      // Save the API key if entered
      if (apiKey) {
        localStorage.setItem("api_key", apiKey);
        localStorage.setItem("gemini_api_key", apiKey); // Also save for the editor
      }
      
      // Save attached image if present
      if (attachedImage) {
        localStorage.setItem(`${projectId}_attached_image`, attachedImage);
        localStorage.setItem(`${projectId}_image_filename`, imageFileName || "attached_image.png");
      }
      
      // Start the simulated generation process
      simulateGeneration();
      
      // Navigate to project page after a delay
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/project?id=${projectId}`);
      }, 5000);
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Failed to create project",
        description: "There was an error creating your project.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("selected_model", modelId);
    toast({
      title: "Model Changed",
      description: `Switched to ${modelId === "gemini-1.5" ? "Gemini 1.5 Flash" : modelId === "gemini-2.0" ? "Gemini 2.0 Flash" : "Gemini 2.0 Pro"}`,
    });
  };

  // Handler for image upload
  const handleImageUpload = (uploadedFile: { name: string, content: string, type: string }) => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
    // The 'type' from FileExplorerUpload is the file extension.
    if (
      typeof uploadedFile.content === 'string' &&
      (uploadedFile.content.startsWith('data:image/') || imageExtensions.includes(uploadedFile.type.toLowerCase()))
    ) {
      setAttachedImage(uploadedFile.content);
      setImageFileName(uploadedFile.name);
      toast({
        title: "Image Attached",
        description: `${uploadedFile.name} has been attached.`,
      });
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a valid image (PNG, JPG, GIF, SVG, WebP).",
        variant: "destructive",
      });
    }
  };

  // Handle attachment button click
  const handleAttachClick = () => {
    document.getElementById('fileUpload')?.click();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const loadProject = (projectId: string) => {
    // Set the current project ID BEFORE navigation 
    // This is critical for project isolation
    localStorage.setItem("current_project_id", projectId);
    
    // Save the API key if entered, to sync between homepage and editor
    if (apiKey) {
      localStorage.setItem("api_key", apiKey);
      localStorage.setItem("gemini_api_key", apiKey);
    }
    
    // Navigate to the project with the ID in the URL
    navigate(`/project?id=${projectId}`);
  };

  const deleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    
    try {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      
      // Also remove project-specific storage items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${projectId}_`)) {
          localStorage.removeItem(key);
        }
      });
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project.",
        variant: "destructive"
      });
    }
  };

  const duplicateProject = (e: React.MouseEvent, projectToDuplicate: Project) => { // Ensure type is Project
    e.stopPropagation();

    const projectLimit = userPlan === "FREE" ? 5 : userPlan === "PRO" ? 12 : userPlan === "TEAMS" ? 20 : Infinity;
    if (projects.length >= projectLimit) {
        toast({
            title: "Project Limit Reached",
            description: `Cannot duplicate project. You have reached the maximum of ${projectLimit} projects for the ${userPlan} plan.`,
            variant: "destructive",
        });
        return;
    }
    
    try {
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const duplicatedProject: Project = { // Ensure type is Project
        ...projectToDuplicate,
        id: projectId,
        name: `Copy of ${projectToDuplicate.name}`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        isFeatured: projectToDuplicate.isFeatured || false, // Carry over featured status
      };
      
      const updatedProjects = [...projects, duplicatedProject];
      setProjects(updatedProjects);
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${projectToDuplicate.id}_`)) {
          const newKey = key.replace(projectToDuplicate.id, projectId);
          const value = localStorage.getItem(key);
          if (value) {
            localStorage.setItem(newKey, value);
          }
        }
      });
      
      toast({
        title: "Project duplicated",
        description: "A copy of the project has been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate the project.",
        variant: "destructive"
      });
    }
  };

  const saveApiKey = () => {
    try {
      localStorage.setItem("api_key", apiKey);
      localStorage.setItem("gemini_api_key", apiKey); // Sync with editor
      toast({
        title: "API Key saved",
        description: "Your API key has been saved successfully.",
      });
      setShowApiKeyInput(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
      <div ref={topRef}></div>
      <HomepageNav />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col">
          {/* Real-time generation status */}
          <GenerationStatus items={generationStatus} visible={showStatus} />
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
            <div className="text-center">
              <h1 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold text-4xl md:text-5xl lg:text-6xl text-center animate-fade-in`}>
                What do you want to build today?
              </h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} mt-4 text-lg`}>
                Prompt, run, edit, and deploy full-stack <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>web</span> and <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>mobile</span> apps.
              </p>
            </div>
            
            <div className="w-full max-w-3xl mt-4 md:mt-8">
              <BorderTrail 
                className="rounded-3xl" 
                variant={theme === 'dark' ? "default" : "primary"} 
                duration="slow"
              >
                <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white shadow-2xl border border-slate-200'} rounded-3xl p-6 space-y-4`}>
                  <ModernPromptInput
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={createNewProject}
                    isLoading={isLoading}
                    onAttach={handleAttachClick}
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                    userPlan={userPlan}
                  />

                  {/* Suggestion buttons */}
                  <div className="space-y-3">
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                      Quick suggestions:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {randomSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`text-left justify-start h-auto p-3 rounded-lg transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">{suggestion}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* File upload section - moved down */}
                  <div>
                    {attachedImage ? (
                      <div className={`p-3 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border border-slate-200'} rounded-md`}>
                        <div className="flex justify-between items-center mb-2">
                          <p className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'} truncate pr-2`}>Attached: {imageFileName}</p>
                          <Button 
                            onClick={() => { setAttachedImage(null); setImageFileName(null); }} 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-400 h-7 w-7 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <img 
                          src={attachedImage} 
                          alt="Attached preview" 
                          className="max-w-full h-auto max-h-40 rounded-md object-contain mx-auto" 
                        />
                      </div>
                    ) : (
                      <div id="fileUpload">
                        <FileExplorerUpload onFileUpload={handleImageUpload} />
                      </div>
                    )}
                  </div>
                </div>
              </BorderTrail>
              
              <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-4">
                <Button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className={`
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'} 
                    font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto
                  `}
                >
                  <Key className="h-4 w-4 mr-2" />
                  {apiKey ? "Change API Key" : "Set API Key"}
                </Button>
              </div>

              {showApiKeyInput && (
                <div className={`mt-4 p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border border-slate-200'} rounded-lg animate-fade-in`}>
                  <label className={`block ${theme === 'dark' ? 'text-white' : 'text-slate-800'} text-sm mb-2`}>API Key</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className={`${theme === 'dark' ? 'bg-black text-white border-white/20' : 'bg-white text-slate-900 border-slate-300 focus:border-primary focus:ring-primary/20'}`}
                    />
                    <Button onClick={saveApiKey} variant={theme === 'dark' ? 'default' : 'modern'} className={`${theme === 'light' && 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects Section using new Tabs component */}
          {projects.length > 0 && <Separator className={`${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'} my-8`} />}
          <ProjectsSection
            projects={projects}
            setProjects={setProjects}
            onLoadProject={loadProject}
            onDeleteProject={deleteProject}
            onDuplicateProject={duplicateProject}
            userPlan={userPlan}
            apiKey={apiKey}
          />

          {/* How to get Started Section */}
          <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <h2 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-12`}>
              How to get Started with Boongle AI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {/* Card 1 */}
              <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'primary' : 'outline'} duration="slow" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-xl border border-slate-200'} p-8 rounded-xl flex flex-col items-center hover:shadow-green-400/10 transition-shadow duration-300`}>
                  <div className={`${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-green-500/50' : 'ring-green-500/30'}`}>
                    <Compass className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>Step 1: Describe Your Idea</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Simply tell Boongle AI what you want to build. Be as descriptive as you like.
                  </p>
                </div>
              </BorderTrail>
              {/* Card 2 */}
               <BorderTrail className="rounded-xl" variant={theme === 'dark' ? "default" : "outline"} duration="slow" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-xl border border-slate-200'} p-8 rounded-xl flex flex-col items-center hover:shadow-blue-400/10 transition-shadow duration-300`}>
                  <div className={`${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-blue-500/50' : 'ring-blue-500/30'}`}>
                    <Code className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>Step 2: AI Generates Code</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Watch as Boongle AI translates your description into functional code in real-time.
                  </p>
                </div>
              </BorderTrail>
              {/* Card 3 */}
              <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'destructive' : 'outline'} duration="slow" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-xl border border-slate-200'} p-8 rounded-xl flex flex-col items-center hover:shadow-purple-400/10 transition-shadow duration-300`}>
                  <div className={`${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-purple-500/50' : 'ring-purple-500/30'}`}>
                    <Rocket className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>Step 3: Iterate & Launch</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Refine your app with further instructions, add features, and deploy your project.
                  </p>
                </div>
              </BorderTrail>
            </div>
          </div>

          {/* Partners Section */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <Separator className={`${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'} my-8`} />
            <h2 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-2xl font-semibold mb-6`}>Our Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <BorderTrail className="rounded-lg" variant={theme === 'dark' ? 'destructive' : 'outline'} duration="default" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20' : 'bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-slate-200'} backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center`}>
                  <Users className="h-10 w-10 text-green-500 mb-3" />
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} font-medium`}>Become a Partner</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} text-sm mt-2`}>
                    Contact us to become our first official partner and get featured here!
                  </p>
                  <Button 
                    className="mt-4" 
                    variant={theme === 'light' ? 'modern' : 'default'}
                    onClick={() => navigate('/important')}
                  >
                    Contact Us
                  </Button>
                </div>
              </BorderTrail>
            </div>
          </div>
          
          {/* 20x Faster Section */}
          <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <Separator className={`${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'} mb-16`} />
            <h2 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-12`}>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">20x Faster than Coding</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'default' : 'outline'} duration="default" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-green-500/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl flex flex-col items-center transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-blue-500/20' : 'ring-blue-500/10'}`}>
                    <Zap className="h-10 w-10 text-yellow-400" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>Lightning Fast</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Turn your ideas into working code in seconds, not hours or days. Skip the boilerplate and focus on what matters.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'primary' : 'outline'} duration="default" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl flex flex-col items-center transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-purple-500/20' : 'ring-purple-500/10'}`}>
                    <Timer className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>Completely Free</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Start building with Boongle AI at no cost. Create up to 5 projects with our powerful AI toolset without spending a dime.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant={theme === 'dark' ? 'destructive' : 'outline'} duration="default" spacing="sm">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl flex flex-col items-center transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/5'} p-4 rounded-full mb-6 ring-2 ${theme === 'dark' ? 'ring-green-500/20' : 'ring-green-500/10'}`}>
                    <Eye className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3`}>See Live Preview Here</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Watch your application come to life as you build it. Real-time preview lets you see changes instantly.
                  </p>
                </div>
              </BorderTrail>
            </div>
          </div>
          
          {/* Design Excellence Section */}
          <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <Separator className={`${theme === 'dark' ? 'bg-white/20' : 'bg-slate-300'} mb-16`} />
            <h2 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-12`}>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Design Excellence</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-white/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl relative overflow-hidden group`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-pink-500/5 to-purple-500/5' : 'bg-gradient-to-r from-pink-500/0 to-purple-500/0'} transform group-hover:scale-105 transition-all duration-700 opacity-50`}></div>
                <div className="relative z-10">
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 ring-pink-500/20' : 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 ring-pink-500/10'} p-4 rounded-full inline-flex mb-6 ring-2`}>
                    <Palette className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>Stunning Visuals</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} leading-relaxed mb-6`}>
                    Our AI understands modern design principles and creates visually appealing interfaces with perfect color harmony, typography, and layout composition.
                  </p>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                      <span>Beautiful gradients and color schemes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Harmonious typography combinations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                      <span>Balanced visual layouts</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-white/10' : 'bg-white border border-slate-200 shadow-lg'} p-8 rounded-xl relative overflow-hidden group`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500/5 to-blue-500/5' : 'bg-gradient-to-r from-indigo-500/0 to-blue-500/0'} transform group-hover:scale-105 transition-all duration-700 opacity-50`}></div>
                <div className="relative z-10">
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20 ring-indigo-500/20' : 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10 ring-indigo-500/10'} p-4 rounded-full inline-flex mb-6 ring-2`}>
                    <Sparkles className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>Interactive Elements</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} leading-relaxed mb-6`}>
                    Create engaging user experiences with micro-animations, transitions, and interactive elements that delight your users.
                  </p>
                  <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                      <span>Smooth animations and transitions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Responsive hover and click effects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500"></div>
                      <span>Engaging scrolling experiences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* "But, what are you building?" Section */}
          <div className="w-full max-w-5xl mx-auto py-24 px-4">
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-white/10' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-slate-200'} rounded-2xl p-12 text-center border shadow-xl`}>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent' : 'text-slate-900'}`}>
                But, what are you building?
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'} max-w-2xl mx-auto mb-8`}>
                It's time to transform your ideas into reality. Let's create something amazing together.
              </p>
              <Button 
                size="lg" 
                onClick={scrollToTop} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-bold text-lg group"
              >
                Start Building
                <ArrowUp className="ml-2 h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
