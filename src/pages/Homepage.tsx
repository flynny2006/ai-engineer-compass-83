import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Key, ArrowRight, Trash2, Copy, Building, Rocket, Code, Users, Compass, Zap, Timer, Eye } from "lucide-react";
import { BorderTrail } from "@/components/ui/border-trail";
import FileExplorerUpload from "@/components/FileExplorerUpload";
import HomepageNav from "@/components/HomepageNav";
import AnimatedAIInput from "@/components/AnimatedAIInput";
import GenerationStatus, { StatusItem } from "@/components/GenerationStatus";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
  lastModified: string;
}

interface Partner {
  id: number;
  name: string;
  description: string;
  logoUrl?: string; 
}

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

  // Sample partners data
  const partners = [
    { id: 1, name: "Acme Tech", description: "Leading AI infrastructure provider", logoUrl: "placeholder.svg" },
    { id: 2, name: "DataFlow Inc.", description: "Enterprise data solutions", logoUrl: "placeholder.svg" },
    { id: 3, name: "CloudNine", description: "Serverless architecture experts", logoUrl: "placeholder.svg" },
  ];

  // Load projects and API key from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      }
      
      const savedApiKey = localStorage.getItem("api_key");
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const simulateGeneration = () => {
    // Clear any existing status
    setGenerationStatus([]);
    setShowStatus(true);
    
    // Simulate the generation process with real-time updates
    const steps = [
      { id: '1', text: 'Analyzing prompt...', status: 'loading' as const, timestamp: Date.now() },
      { id: '2', text: 'Creating project structure', status: 'loading' as const, timestamp: Date.now() + 100 },
      { id: '3', text: 'Generating index.html', status: 'pending' as const, timestamp: Date.now() + 200 },
      { id: '4', text: 'Generating styles.css', status: 'pending' as const, timestamp: Date.now() + 300 },
      { id: '5', text: 'Generating app.js', status: 'pending' as const, timestamp: Date.now() + 400 },
      { id: '6', text: 'Building React components', status: 'pending' as const, timestamp: Date.now() + 500 },
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
            item.id === '2' ? { ...item, status: 'complete' } : item
          ));
          
          setTimeout(() => {
            setGenerationStatus(prev => prev.map(item => 
              item.id === '3' ? { ...item, status: 'complete' } : item
            ).concat({ ...steps[3], status: 'loading' }));
            
            setTimeout(() => {
              setGenerationStatus(prev => prev.map(item => 
                item.id === '4' ? { ...item, status: 'complete' } : item
              ).concat({ ...steps[4], status: 'loading' }));
              
              setTimeout(() => {
                setGenerationStatus(prev => prev.map(item => 
                  item.id === '5' ? { ...item, status: 'complete' } : item
                ).concat({ ...steps[5], status: 'loading' }));
                
                setTimeout(() => {
                  setGenerationStatus(prev => prev.map(item => 
                    item.id === '6' ? { ...item, status: 'complete' } : item
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
    if (projects.length >= 5) {
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
    const newProject = {
      id: projectId,
      name: prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      files: [], // Will be populated in the project editor
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

  const duplicateProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();

    if (projects.length >= 5) {
      toast({
        title: "Project Limit Reached",
        description: "Cannot duplicate project. You have reached the maximum of 5 projects for the free plan.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const duplicatedProject = {
        ...project,
        id: projectId,
        name: `Copy of ${project.name}`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      
      const updatedProjects = [...projects, duplicatedProject];
      setProjects(updatedProjects);
      localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${project.id}_`)) {
          const newKey = key.replace(project.id, projectId);
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

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    toast({
      title: "Model Changed",
      description: `Switched to ${modelId === "gemini-1.5" ? "Gemini 1.5 Flash" : "Gemini 2.0 Flash"}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <HomepageNav />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col">
          {/* Real-time generation status */}
          <GenerationStatus items={generationStatus} visible={showStatus} />
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
            <div className="text-center">
              <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl text-center animate-fade-in">
                What do you want to build today?
              </h1>
              <p className="text-gray-400 mt-4 text-lg">
                Prompt, run, edit, and deploy full-stack <span className="font-bold text-white">web</span> and <span className="font-bold text-white">mobile</span> apps.
              </p>
            </div>
            
            <div className="w-full max-w-3xl mt-4 md:mt-8">
              <BorderTrail className="rounded-lg" variant="default" duration="slow">
                <div className="bg-black rounded-lg p-4 space-y-4">
                  <AnimatedAIInput
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={createNewProject}
                    placeholder="Ask Boongle AI to build anything..."
                    isLoading={isLoading}
                    onAttach={() => document.getElementById('fileUpload')?.click()}
                    className="min-h-[120px]"
                    onModelChange={handleModelChange}
                    selectedModel={selectedModel}
                  />

                  <div>
                    {attachedImage ? (
                      <div className="p-3 bg-white/5 rounded-md border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-white/80 truncate pr-2">Attached: {imageFileName}</p>
                          <Button 
                            onClick={() => { setAttachedImage(null); setImageFileName(null); }} 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-300 h-7 w-7 flex-shrink-0"
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
                  variant="outline"
                  className={`border-white/20 ${theme === 'light' ? 'text-black' : 'text-white/80'} hover:bg-white/10 w-full sm:w-auto`}
                >
                  <Key className="h-4 w-4 mr-2" />
                  {apiKey ? "Change API Key" : "Set API Key"}
                </Button>
              </div>

              {showApiKeyInput && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 animate-fade-in">
                  <label className="block text-white text-sm mb-2">API Key</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="bg-black text-white border-white/20"
                    />
                    <Button onClick={saveApiKey}>Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How to get Started Section */}
          <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              How to get Started with Boongle AI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <BorderTrail className="rounded-xl" variant="primary" duration="slow" spacing="sm">
                <div className="bg-white/5 p-8 rounded-xl border-none flex flex-col items-center shadow-xl hover:shadow-green-400/20 transition-shadow duration-300">
                  <div className="bg-green-500/20 p-4 rounded-full mb-6 ring-2 ring-green-500/50">
                    <Compass className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Step 1: Describe Your Idea</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Simply tell Boongle AI what you want to build. Be as descriptive as you like – from a simple landing page to a full-stack application.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant="default" duration="slow" spacing="sm">
                <div className="bg-white/5 p-8 rounded-xl border-none flex flex-col items-center shadow-xl hover:shadow-blue-400/20 transition-shadow duration-300">
                  <div className="bg-blue-500/20 p-4 rounded-full mb-6 ring-2 ring-blue-500/50">
                    <Code className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Step 2: AI Generates Code</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Watch as Boongle AI translates your description into functional code in real-time. Preview your application as it comes to life.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant="destructive" duration="slow" spacing="sm">
                <div className="bg-white/5 p-8 rounded-xl border-none flex flex-col items-center shadow-xl hover:shadow-purple-400/20 transition-shadow duration-300">
                  <div className="bg-purple-500/20 p-4 rounded-full mb-6 ring-2 ring-purple-500/50">
                    <Rocket className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Step 3: Iterate & Launch</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Refine your app with further instructions, add features, and deploy your project to the world with a single click.
                  </p>
                </div>
              </BorderTrail>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="mt-12 w-full max-w-3xl mx-auto">
              <Separator className="bg-white/20 my-8" />
              <h2 className="text-white text-2xl font-semibold mb-6">Your Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => loadProject(project.id)}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1"
                  >
                    <h3 className="text-white font-medium text-lg">{project.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => duplicateProject(e, project)} 
                        className="text-blue-400 hover:text-blue-300 p-1"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => deleteProject(e, project.id)} 
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-1">
                        <ArrowRight className="h-4 w-4" /> Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Partners Section */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <Separator className="bg-white/20 my-8" />
            <h2 className="text-white text-2xl font-semibold mb-6">Our Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <BorderTrail 
                  key={partner.id} 
                  className="rounded-lg" 
                  variant="primary" 
                  duration="default" 
                  spacing="sm"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center border-none">
                    <div className="mb-3 w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={`${partner.name} logo`}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Building className="h-8 w-8 text-white/60" />
                      )}
                    </div>
                    <h3 className="text-white font-medium">{partner.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {partner.description}
                    </p>
                  </div>
                </BorderTrail>
              ))}
              
              <BorderTrail className="rounded-lg" variant="destructive" duration="default" spacing="sm">
                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center border-none">
                  <Users className="h-10 w-10 text-green-400 mb-3" />
                  <h3 className="text-white font-medium">Become a Partner</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Contact us to get featured as a partner here!
                  </p>
                  <Button className="mt-4" variant={theme === 'light' ? 'modern' : 'default'}>
                    Contact Us
                  </Button>
                </div>
              </BorderTrail>
            </div>
          </div>
          
          {/* 20x Faster Section */}
          <div className="w-full max-w-5xl mx-auto py-16 px-4">
            <Separator className="bg-white/20 mb-16" />
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">20x Faster than Coding</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <BorderTrail className="rounded-xl" variant="default" duration="default" spacing="sm">
                <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 p-8 rounded-xl flex flex-col items-center shadow-xl transition-all duration-300 hover:-translate-y-1 border-none">
                  <div className="bg-blue-500/10 p-4 rounded-full mb-6 ring-2 ring-blue-500/20">
                    <Zap className="h-10 w-10 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Turn your ideas into working code in seconds, not hours or days. Skip the boilerplate and focus on what matters.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant="primary" duration="default" spacing="sm">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-xl flex flex-col items-center shadow-xl transition-all duration-300 hover:-translate-y-1 border-none">
                  <div className="bg-purple-500/10 p-4 rounded-full mb-6 ring-2 ring-purple-500/20">
                    <Timer className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Completely Free</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Start building with Boongle AI at no cost. Create up to 5 projects with our powerful AI toolset without spending a dime.
                  </p>
                </div>
              </BorderTrail>

              <BorderTrail className="rounded-xl" variant="destructive" duration="default" spacing="sm">
                <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-8 rounded-xl flex flex-col items-center shadow-xl transition-all duration-300 hover:-translate-y-1 border-none">
                  <div className="bg-green-500/10 p-4 rounded-full mb-6 ring-2 ring-green-500/20">
                    <Eye className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">See Live Preview Here</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Watch your application come to life as you build it. Real-time preview lets you see changes instantly.
                  </p>
                </div>
              </BorderTrail>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
