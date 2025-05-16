import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Send, ArrowRight, Trash2, Copy, Key, ArrowUp } from "lucide-react";
import { BorderTrail } from "@/components/ui/border-trail";
import FileExplorerUpload from "@/components/FileExplorerUpload";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
  lastModified: string;
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

  const createNewProject = () => {
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
      
      // Set the current project ID BEFORE navigation
      // This is important for project-specific storage
      localStorage.setItem("current_project_id", projectId);
      
      // Save the API key if entered
      if (apiKey) {
        localStorage.setItem("api_key", apiKey);
        localStorage.setItem("gemini_api_key", apiKey); // Also save for the editor
      }
      
      // Navigate to project page
      setTimeout(() => {
        navigate(`/project?id=${projectId}`);
      }, 500);
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
      
      // Also duplicate all project-specific storage items
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
  const handleImageUpload = (uploadedFile: { name: string, content: string | ArrayBuffer, type: string }) => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
    // The 'type' from FileExplorerUpload is the file extension.
    // The 'content' will be a base64 string (DataURL) if it was read as an image.
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

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
          <div className="text-center">
            <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl text-center animate-fade-in">
              What do you want to build today?
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Build fullstack <span className="font-bold text-white">web</span> and <span className="font-bold text-white">mobile</span> apps in seconds.
            </p>
          </div>
          
          <div className="w-full max-w-3xl mt-4 md:mt-8">
            <BorderTrail className="rounded-lg" variant="default" duration="slow">
              <div className="bg-black rounded-lg p-4 space-y-4">
                <div className="relative">
                  <Textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask Boongle AI to build anything..."
                    className="bg-transparent text-white border border-white/20 min-h-[180px] rounded-lg p-4 placeholder:text-gray-400 pr-16 w-full"
                  />
                  <Button 
                    onClick={createNewProject}
                    disabled={isLoading} 
                    className="bg-white text-black hover:bg-gray-100 rounded-full p-0 h-14 w-14 shadow-md flex items-center justify-center absolute right-4 bottom-4"
                    variant="circle"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <ArrowUp className="h-6 w-6 text-black" />
                    )}
                  </Button>
                </div>

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
                    <FileExplorerUpload onFileUpload={handleImageUpload} />
                  )}
                </div>
              </div>
            </BorderTrail>
            
            <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-4">
              <Button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10 w-full sm:w-auto"
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
      </div>
    </div>
  );
};

export default Homepage;
