
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Index from './Index';
import { toast } from '@/hooks/use-toast';

const ProjectEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    // Get project ID from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');
    
    // If there's a project ID in the URL, set it as current
    if (projectId) {
      localStorage.setItem("current_project_id", projectId);
      
      // Load project files based on project ID
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const project = projects.find((p: any) => p.id === projectId);
        
        if (project) {
          // If project has saved files, load them
          if (project.files && project.files.length > 0) {
            localStorage.setItem("project_files", JSON.stringify(project.files));
          } else {
            // If no saved files for this project yet, use defaults from Index.tsx
            localStorage.removeItem("project_files");
          }
          
          // Save last accessed timestamp
          const updatedProjects = projects.map((p: any) => 
            p.id === projectId 
              ? { ...p, lastModified: new Date().toISOString() } 
              : p
          );
          localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
        }
      }
      
      setInitializing(false);
    } else {
      // Check if there's already a current project ID in localStorage
      const currentProjectId = localStorage.getItem("current_project_id");
      
      if (!currentProjectId) {
        // If no project ID found, redirect to homepage
        navigate('/');
        return;
      }
      
      // Update the URL to include the project ID
      navigate(`/project?id=${currentProjectId}`, { replace: true });
      setInitializing(false);
    }
  }, [navigate, location.search]);

  // Disable navigation messages
  useEffect(() => {
    // Create style to hide notification boxes
    const style = document.createElement('style');
    style.textContent = `
      .toaster .toast[data-title="Navigation"] {
        display: none !important;
      }
      
      /* Hide all navigation-related toasts */
      .toast-title:contains('Navigation'), 
      div[data-toast-title="Navigation"],
      .sonner-toast:has([data-toast-title="Navigation"]) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Index />;
};

export default ProjectEditor;
