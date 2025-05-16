
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Send, ArrowRight } from "lucide-react";

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

  // Load projects from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
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
      localStorage.setItem("current_project_id", projectId);
      
      // Navigate to project page
      setTimeout(() => {
        navigate("/project");
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
    localStorage.setItem("current_project_id", projectId);
    navigate("/project");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="container max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
          <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl text-center animate-fade-in">
            What do you want to build today?
          </h1>
          
          <div className="w-full max-w-3xl mt-4 md:mt-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-pulse-glow"></div>
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build..."
                className="relative bg-black text-white border border-white/20 min-h-[180px] rounded-lg p-4 placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={createNewProject}
                disabled={isLoading} 
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-6 rounded-full text-lg font-medium hover:opacity-90 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span>Start Building</span>
                  </div>
                )}
              </Button>
            </div>
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
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0">
                      <ArrowRight className="h-4 w-4 mr-1" /> Open
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
